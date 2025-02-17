import Fuse from 'fuse.js';
import { ModuleReplacement } from '~/types/module-manifests';

const fuseInstance = new Fuse<{ key: string; value: ModuleReplacement }>([], {
    keys: [
        'value.moduleName',
        { name: 'value.replacement', weight: 0.5 },
        { name: 'value.mdnPath', weight: 0.25 },
    ],
    shouldSort: true,
    isCaseSensitive: true,
    ignoreDiacritics: true,
});

export default defineCachedEventHandler(
    async (event) => {
        const { q } = getQuery(event) ?? {};
        if (q == null || typeof q !== 'string') {
            throw Error('No search term provided');
        }
        const storage = useStorage<ModuleReplacement>('replacement-manifest');
        const arr: { key: string; value: ModuleReplacement }[] = [];
        for (const key of await storage.getKeys()) {
            const value = await storage.getItem(key);
            if (value) {
                arr.push({ key, value });
            }
        }
        fuseInstance.setCollection(arr);

        return fuseInstance.search(q, { limit: 10 }).map(({ item }) => item);
    },
    { maxAge: 60 },
);
