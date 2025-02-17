import { ManifestModule, ModuleReplacement } from '~/types/module-manifests';

const MANIFEST_URLS = [
    'https://raw.githubusercontent.com/es-tooling/module-replacements/refs/heads/main/manifests/micro-utilities.json',
    'https://raw.githubusercontent.com/es-tooling/module-replacements/refs/heads/main/manifests/native.json',
    'https://raw.githubusercontent.com/es-tooling/module-replacements/refs/heads/main/manifests/preferred.json',
];

export default defineTask({
    meta: {
        name: 'fetch-manifests',
    },
    async run() {
        const storage = useStorage<ModuleReplacement>('replacement-manifest');

        console.log('Fetching module replacement manifests');

        const promises = MANIFEST_URLS.map(async (manifestUrl) => {
            const { moduleReplacements } = await fetch(manifestUrl).then(
                (r) => r.json() as Promise<ManifestModule>,
            );
            return moduleReplacements;
        });

        const promiseResult = (await Promise.all(promises)).flat(1);

        await storage.clear();

        const newItems = promiseResult.map(async (rep, i) => {
            const key = `${rep.type}-${i.toString(16)}-${rep.moduleName.replaceAll('/', '___')}`;
            await storage.setItem(key, rep);
        });
        await Promise.allSettled(newItems);

        return { result: 'success' };
    },
});
