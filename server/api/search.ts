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
    const prefix = 'replacement-manifest:';
    const storage = useStorage<ModuleReplacement>('replacement-manifest');

    const [index, keys] = await Promise.all([
        fuseStorage.getItem('replacements'),
        storage.getKeys(),
    ]);
    const arr = (await storage.getItems(keys.map((key) => prefix + key)))
        .map(({ key, value }) => ({ key: key.slice(prefix.length), value }))
        .sort((a, b) =>
            a.key.localeCompare(b.key, undefined, { sensitivity: 'base' }),
        );

    const fuse = new Fuse(
        arr,
        FUSE_SETTINGS,
        index ? Fuse.parseIndex(index) : undefined,
    );
    return fuse.search(q, { limit: 50 }).map(({ item }) => item);
});
