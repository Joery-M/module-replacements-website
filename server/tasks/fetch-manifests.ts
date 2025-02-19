import type {
    ManifestModule,
    ModuleReplacement,
} from '~/types/module-manifests';
import type { GithubJsonFile, GithubMarkdownFile } from '~/types/ungh';

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
        const storage = useStorage<ModuleReplacement>('replacement-manifest');
        const docStorage = useStorage<string>('replacement-docs');

        console.log('Fetching module replacement manifests');

        const fetchDocumentation = async (
            key: string,
            docPath: string,
        ): Promise<void> => {
            const path = docPath.endsWith('.md') ? docPath : `${docPath}.md`;
            const res = await fetch(
                `https://ungh.cc/repos/es-tooling/module-replacements/files/main/docs/modules/${path}`,
            );
            if (res.status === 200) {
                const data = (await res.json()) as GithubMarkdownFile;
                await docStorage.setItem(key, data.file.contents);
            }
        };

        const promises = MANIFEST_URLS.map(async (manifestUrl) => {
            const json = await fetch(manifestUrl).then(
                (r) => r.json() as Promise<GithubJsonFile>,
            );

            return (JSON.parse(json.file.contents) as ManifestModule)
                .moduleReplacements;
        });

        const promiseResult = (await Promise.all(promises)).flat(1);

        await docStorage.clear();
        await storage.clear();

        const newItems = promiseResult.map(async (rep) => {
            const baseName = `${rep.type}-${rep.moduleName.replaceAll('/', '___')}`;
            let key = baseName;
            let i = 0;
            // Prevent duplicates
            while (await storage.has(key)) {
                key = `${baseName}-${i}`;
            }
            await storage.setItem(key, rep);

            if (rep.type === 'documented') {
                await fetchDocumentation(key, rep.docPath);
            }
        });
        await Promise.allSettled(newItems);

        return { result: 'success' };
    },
});
