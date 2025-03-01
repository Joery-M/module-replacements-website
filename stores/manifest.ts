export async function fetchManifest(query: string) {
    const manifest = await $fetch(`/api/module`, {
        params: { module: query },
    });
    const documentation =
        manifest && manifest.type === 'documented'
            ? await $fetch(`/api/module/doc`, {
                  params: { doc: manifest.docPath },
              })
            : undefined;

    return { manifest, documentation };
}
