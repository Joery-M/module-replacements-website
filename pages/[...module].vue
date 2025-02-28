<template>
    <header
        text-center
        bg-secondary
        py-10
        px-5
        class="contrast:(b-solid b-0 b-b light:b-neutral-7 dark:b-neutral-3)"
    >
        <h1>Module Replacements</h1>
        <SearchBar mt-20 :query="data?.manifest?.moduleName" />
    </header>
    <div flex justify-center>
        <main :aria-busy="status === 'pending'">
            <ModuleDisplay
                :loading-status="status"
                :documentation="data?.documentation"
                :manifest="data?.manifest"
            />
        </main>
    </div>
</template>

<script setup lang="ts">
import { fetchManifest } from '~/stores/manifest';

const route = useRoute();

const { data, status } = await useAsyncData(
    `documentation`,
    async () => {
        if (route.query.q) {
            return await fetchManifest(
                Array.isArray(route.query.q)
                    ? route.query.q.join('')
                    : route.query.q,
            );
        } else if (route.params.module) {
            return await fetchManifest(
                Array.isArray(route.params.module)
                    ? route.params.module.join('')
                    : route.params.module,
            );
        }
        return null;
    },
    { watch: [() => route.query.q] },
);

useSeoMeta({
    title: () =>
        data.value?.manifest?.moduleName
            ? `${data.value?.manifest?.moduleName} - Module Replacements`
            : `Module Replacements`,
});
</script>

<style lang="scss">
main {
    @apply w-full;

    > *:not(.MDC) {
        @apply max-w-670px mx-auto;
    }

    > .MDC {
        @apply max-w-4xl mx-auto;

        > :not(table) {
            @apply max-w-670px mx-auto;
        }
    }
}
</style>
