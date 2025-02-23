<template>
    <header text-center bg-secondary py-10 b-b-base border-base b-b>
        <h1>Module Replacements</h1>
        <SearchBar mt-20 :value="routedModule" />
    </header>
    <div flex justify-center>
        <main max-w-screen-md w-full>
            <template
                v-if="status !== 'pending' && data?.selectedModule"
                :aria-busy="status === 'pending'"
            >
                <h1 v-if="!data.documentation">
                    {{ data.selectedModule.moduleName }}
                </h1>
                <MDC
                    v-if="data.documentation"
                    :value="data.documentation"
                    tag="article"
                    class="MDC"
                />
            </template>
            <div v-else flex justify-center>
                <div
                    text-3xl
                    mt-10
                    aria-details="Loading..."
                    class="i-ph-circle-notch animate-spin"
                />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();

const { data, status } = await useAsyncData(
    `documentation`,
    async () => {
        const mod = await $fetch(`/api/module/${route.query.q}`);
        const documentation =
            mod && mod.type === 'documented'
                ? await $fetch(`/api/module/doc/${mod.docPath}`)
                : undefined;

        return { selectedModule: mod, documentation };
    },
    { watch: [() => route.query.q] },
);

const routedModule = useState('prefilled-module-name', () => {
    if (data.value?.selectedModule?.moduleName && import.meta.server) {
        return data.value.selectedModule.moduleName;
    }
});
</script>
