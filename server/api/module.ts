import * as v from 'valibot';
import type { ModuleReplacement } from '~/types/module-manifests';

const validation = v.object({
    id: v.pipe(v.string(), v.minLength(1)),
});

export default defineCachedEventHandler(async (event) => {
    const { id } = await getValidatedQuery(event, (q) =>
        v.parse(validation, q),
    );

    const storage = useStorage<ModuleReplacement>('replacement-manifest');
    const res = await storage.getItem(id);
    if (!res) {
        setResponseStatus(event, 404, 'Not Found');
    }
    return res;
});
