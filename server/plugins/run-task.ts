export default nitroPlugin((nitro) => {
    if (import.meta.preset !== 'cloudflare-worker') return;

    addEventListener('scheduled', (event) => {
        if (event.cron === '0 * * * *') {
            event.waitUntil(runTask('fetch-manifests'));
        }
    });
});
