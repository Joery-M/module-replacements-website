import Fuse, { type FuseIndexRecords, type IFuseOptions } from 'fuse.js';
import * as v from 'valibot';
import type {
    KeyedModuleReplacement,
    ModuleReplacement,
} from '~/types/module-manifests';

export const FUSE_SETTINGS: IFuseOptions<KeyedModuleReplacement> = {
    keys: ['value.moduleName', { name: 'value.replacement', weight: 0.5 }],
    shouldSort: true,
    isCaseSensitive: false,
    ignoreDiacritics: true,
};

const validation = v.object({
    q: v.pipe(v.string()),
});

export default eventHandler(async (event) => {
    const { q } = await getValidatedQuery(event, (d) => v.parse(validation, d));
    if (!q) return [];

    const fuseStorage = useStorage<{
        keys: ReadonlyArray<string>;
        records: FuseIndexRecords;
    }>('fuse');
    const prefix = 'replacement-manifest';
    const storage = useStorage<ModuleReplacement>(prefix);

    const [index, keys] = await Promise.all([
        fuseStorage.getItem('replacements'),
        useStorage().getKeys(prefix),
    ]);

    const arr = (await storage.getItems(keys))
        .map(({ key, value }) => ({ key: key.slice(prefix.length + 1), value }))
        .sort((a, b) =>
            a.key.localeCompare(b.key, undefined, { sensitivity: 'base' }),
        );

    const fuse = new Fuse(
        arr,
        FUSE_SETTINGS,
        index ? Fuse.parseIndex(index) : undefined,
    );
    // Store index
    if (!index) {
        console.log('Fill fuse');
        fuseStorage.setItem('replacements', fuse.getIndex().toJSON());
    }
    return fuse.search(q, { limit: 50 }).map(({ item }) => item);
});
