import Fuse from 'fuse.js';
import * as v from 'valibot';
import type {
    KeyedModuleReplacement,
    ModuleReplacement,
} from '~/types/module-manifests';

const fuseInstance = new Fuse<KeyedModuleReplacement>([], {
    keys: [
        'value.moduleName',
        { name: 'value.replacement', weight: 0.5 },
        { name: 'value.mdnPath', weight: 0.25 },
    ],
    shouldSort: true,
    isCaseSensitive: true,
    ignoreDiacritics: true,
});

const validation = v.object({
    q: v.pipe(v.string(), v.minLength(1)),
});

export default defineCachedEventHandler(
    async (event) => {
        const { q } = await getValidatedQuery(event, (d) =>
            v.parse(validation, d),
        );

        const storage = useStorage<ModuleReplacement>('replacement-manifest');
        const arr: KeyedModuleReplacement[] = [];
        for (const key of await storage.getKeys()) {
            const value = await storage.getItem(key);
            if (value) {
                arr.push({ key, value });
            }
        }
        fuseInstance.setCollection(arr);

        return fuseInstance.search(q, { limit: 50 }).map(({ item }) => item);
    },
    { maxAge: 60 },
);
