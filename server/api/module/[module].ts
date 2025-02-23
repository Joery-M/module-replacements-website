import * as v from 'valibot';
import type { ModuleReplacement } from '~/types/module-manifests';

const validation = v.object({
    module: v.pipe(v.string(), v.minLength(1)),
});

export default defineCachedEventHandler(async (event) => {
    const { module: id } = await getValidatedRouterParams(event, (q) =>
        v.parse(validation, q),
    );

    const storage = useStorage<ModuleReplacement>('replacement-manifest');
    const res = await storage.getItem(id);
    if (!res) {
        setResponseStatus(event, 404, 'Not Found');
    }
    return res;
});
