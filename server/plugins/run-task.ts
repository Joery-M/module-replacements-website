export default nitroPlugin((nitro) => {
    addEventListener('scheduled', (event) => {
        if (event.cron === '0 * * * *') {
            event.waitUntil(runTask('fetch-manifests'));
        }
    });
});
