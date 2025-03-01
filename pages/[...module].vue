<template>
    <div min-h-100dvh>
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

        <!-- Allow mismatch since the loading spinner was giving problems -->
        <main
            pb-36
            :aria-busy="status === 'pending'"
            data-allow-mismatch="children"
        >
            <div v-if="status === 'pending'" flex justify-center>
                <div
                    text-3xl
                    mt-10
                    aria-details="Loading..."
                    class="i-ph-circle-notch animate-spin"
                />
            </div>
            <ModuleDisplay
                v-else-if="data?.manifest"
                :documentation="data.documentation"
                :manifest="data.manifest"
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
        data.value?.manifest
            ? `${data.value?.manifest?.moduleName} - Module Replacements`
            : `Module Replacements`,
});
</script>

<style lang="scss" scoped>
main {
    @apply w-full;

    :deep(> *:not(.MDC)) {
        @apply max-w-670px mx-auto;
    }

    :deep(> .MDC) {
        @apply max-w-4xl mx-auto px-5;

        > :not(.table-wrapper) {
            @apply max-w-670px mx-auto;
        }

        > .table-wrapper {
            @apply of-x-auto outline-1 outline-solid outline-offset--1 outline-base border-collapse;
        }
    }
}
</style>
