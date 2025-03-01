import * as v from 'valibot';

const validation = v.object({
    doc: v.pipe(v.string(), v.minLength(1)),
});

export default cachedEventHandler(
    async (event) => {
        const { doc } = await getValidatedQuery(event, (q) =>
            v.parse(validation, q),
        );

        const docStorage = useStorage<string>('replacement-docs');
        const item = await docStorage.getItem(doc);
        if (!item) {
            setResponseStatus(event, 404, 'Not Found');
        }
        return item;
    },
    { maxAge: 3600 },
);
