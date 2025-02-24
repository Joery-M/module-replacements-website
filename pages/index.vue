<template>
    <header
        text-center
        bg-secondary
        py-10
        class="contrast:(b-solid b-0 b-b light:b-neutral-7 dark:b-neutral-3)"
    >
        <h1>Module Replacements</h1>
        <SearchBar mt-20 :value="data?.module?.moduleName ?? ''" />
    </header>
    <div flex justify-center>
        <main max-w-screen-md w-full>
            <template
                v-if="status !== 'pending' && data?.module"
                :aria-busy="status === 'pending'"
            >
                <template v-if="data.module.type === 'documented'">
                    <MDC
                        :value="data.documentation ?? ''"
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
                <template v-else-if="data.module.type === 'native'">
                    <MDC
                        :value="formatNativeDoc(data.module)"
                        tag="article"
                        class="MDC"
                    />
                </template>
                <template v-else>
                    <h1>
                        {{ data.module.moduleName }}
                    </h1>
                    <p>
                        Gonna be honest, idk how you got here.
                        <a href="https://bsky.app/profile/joery.com">
                            Please tell me on BlueSky!
                        </a>
                    </p>
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
import type { NativeModuleReplacement } from '~/types/module-manifests';

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

function formatNativeDoc(mod: NativeModuleReplacement) {
    return `# ${mod.moduleName}
A native replacement is available for \`${mod.moduleName}\`:

\`\`\`js
${mod.replacement}
\`\`\`

[MDN Web Docs](${formatMDNUrl(mod)})
[Caniuse entry](${formatCaniuseUrl(mod)})
`;
}

function formatMDNUrl(mod: NativeModuleReplacement) {
    // Prevent XSS
    const path = mod.mdnPath.replaceAll(')', '\\)');

    return (
        'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/' +
        path
    );
}
function formatCaniuseUrl(mod: NativeModuleReplacement) {
    return (
        'https://caniuse.com/?search=' +
        encodeURIComponent(
            'builtin: ' + mod.replacement.replace('.prototype.', '.'),
        )
    );
}
</script>
