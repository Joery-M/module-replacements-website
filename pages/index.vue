<template>
    <header text-center bg-secondary py-10 b-b-base border-base b-b>
        <h1>Module Replacements</h1>
        <SearchBar mt-20 :value="routedModule" />
    </header>
    <div flex justify-center>
        <main max-w-screen-md w-full>
            <template
                v-if="status !== 'pending' && data?.module"
                :aria-busy="status === 'pending'"
            >
                <template v-if="data.documentation">
                    <MDC
                        :value="data.documentation"
                        tag="article"
                        class="MDC"
                    />
                </template>
                <template v-else-if="data.module.type === 'simple'">
                    <h1>
                        {{ data.module.moduleName }}
                    </h1>
                    <MDC
                        :value="
                            formatSimpleReplacement(data.module.replacement)
                        "
                        tag="article"
                        class="MDC"
                    />
                </template>
                <template v-else>
                    <h1>
                        {{ data.module.moduleName }}
                    </h1>
                </template>
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

        return { module: mod, documentation };
    },
    { watch: [() => route.query.q] },
);

const routedModule = useState('prefilled-module-name', () => {
    if (data.value?.module?.moduleName && import.meta.server) {
        return data.value.module.moduleName;
    }
});

function formatSimpleReplacement(doc: string) {
    let newString = '';
    let inCode = false;

    for (let i = 0; i < doc.length; i++) {
        const char = doc[i];
        const rest = doc.slice(i);

        if (newString.toLowerCase().endsWith('use ') && !inCode) {
            newString += '`';
            inCode = true;
        } else if (rest.startsWith(', or ') && inCode) {
            newString += '`';
            inCode = false;
        } else if (rest.startsWith(' or ') && inCode) {
            // Edge case for simple-is-whitespace
            newString += '` or `';
            i += 3;
            continue;
        }
        newString += char;

        // Final char
        if (rest.length === 1 && inCode) {
            newString += '`';
        }
    }
    return newString;
}
</script>
