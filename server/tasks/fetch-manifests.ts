import Fuse, { type FuseIndexRecords } from 'fuse.js';
import type {
    ManifestModule,
    ModuleReplacement,
} from '~/types/module-manifests';
import type { GithubJsonFile, GithubMarkdownFile } from '~/types/ungh';
import { FUSE_SETTINGS } from '../api/search';
import pThrottle from 'p-throttle';

const MANIFEST_URLS = [
    'https://ungh.cc/repos/es-tooling/module-replacements/files/main/manifests/micro-utilities.json',
    'https://ungh.cc/repos/es-tooling/module-replacements/files/main/manifests/native.json',
    'https://ungh.cc/repos/es-tooling/module-replacements/files/main/manifests/preferred.json',
];

export default defineTask({
    meta: {
        name: 'fetch-manifests',
    },
    async run() {
        const fuseStorage = useStorage<{
            keys: ReadonlyArray<string>;
            records: FuseIndexRecords;
        }>('fuse');
        const manifestStorage = useStorage<ModuleReplacement>(
            'replacement-manifest',
        );
        const docStorage = useStorage<string>('replacement-docs');

        console.log('Fetching module replacement manifests');

        const throttle = pThrottle({ limit: 2, interval: 500 });
        const fetchDocumentation = throttle(
            async (docPath: string): Promise<void> => {
                if (await docStorage.hasItem(docPath)) return;

                const path = docPath.endsWith('.md')
                    ? docPath
                    : `${docPath}.md`;
                const res = await fetch(
                    `https://ungh.cc/repos/es-tooling/module-replacements/files/main/docs/modules/${path}`,
                ).catch((res) => {
                    console.error(
                        'Error fetching documentation: ' + docPath + '\n',
                        res,
                    );
                });
                if (res?.status === 200) {
                    const data = (await res.json()) as GithubMarkdownFile;
                    await docStorage.setItem(docPath, data.file.contents);
                }
            },
        );

        const promises = MANIFEST_URLS.map(async (manifestUrl) => {
            const json = await fetch(manifestUrl)
                .then((r) => r.json() as Promise<GithubJsonFile>)
                .catch((res) => {
                    console.error(
                        'Error fetching manifest: ' + manifestUrl,
                        res,
                    );
                });

            if (!json) return [];
            return (JSON.parse(json.file.contents) as ManifestModule)
                .moduleReplacements;
        });

        const promiseResult = (await Promise.all(promises)).flat(1);

        await docStorage.clear();
        await manifestStorage.clear();

        const docsToFetch = new Set<string>();
        const items$ = promiseResult.map(async (rep) => {
            const baseName = `${rep.type}-${rep.moduleName.replaceAll('/', '___')}`;
            let key = baseName;
            let i = 0;
            // Prevent duplicates
            while (await manifestStorage.has(key)) {
                key = `${baseName}-${i}`;
            }
            await manifestStorage.setItem(key, rep);

            if (rep.type === 'documented') {
                docsToFetch.add(rep.docPath);
            }
            return { key, value: rep };
        });
        const items = await Promise.all(items$);

        for await (const doc of docsToFetch.values()) {
            await fetchDocumentation(doc);
        }

        const index = Fuse.createIndex(
            FUSE_SETTINGS.keys!,
            items.sort((a, b) =>
                a.key.localeCompare(b.key, undefined, { sensitivity: 'base' }),
            ),
        );
        fuseStorage.setItem('replacements', index.toJSON());

        return { result: 'success' };
    },
});
