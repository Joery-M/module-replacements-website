<template>
    <main>
        <section text-center>
            <h1 mt-10>Module Replacements</h1>
            <SearchBar mt-20 :value="selectedModule?.moduleName" />
        </section>
        {{ selectedModule?.moduleName }}
        <pre>{{ documentation }}</pre>
    </main>
</template>

<script setup lang="ts">
import type { ModuleReplacement } from '~/types/module-manifests';

const route = useRoute();

const selectedModule = computedAsync<ModuleReplacement | undefined>(
    async () => {
        const res = await useFetch('/api/module', {
            query: { id: route.query.q },
        });
        return res.data.value ?? undefined;
    },
);

const documentation = computedAsync(async () => {
    const res = await useFetch('/api/module/doc', {
        query: { id: route.query.q },
    });

    return res.data.value ?? undefined;
});
</script>
