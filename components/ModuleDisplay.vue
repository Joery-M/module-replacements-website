<template>
    <template v-if="manifest.type === 'documented'">
        <MDC :value="documentation ?? ''" tag="article" class="MDC" />
    </template>
    <template v-else-if="manifest.type === 'simple'">
        <h1>
            {{ manifest.moduleName }}
        </h1>
        <MDC
            :value="formatSimpleReplacement(manifest.replacement)"
            tag="article"
            class="MDC"
        />
    </template>
    <template v-else-if="manifest.type === 'native'">
        <MDC :value="formatNativeDoc(manifest)" tag="article" class="MDC" />
    </template>
    <template v-else>
        <h1>
            {{ manifest.moduleName }}
        </h1>
        <p>
            Gonna be honest, idk how you got here.
            <a href="https://bsky.app/profile/joery.com">
                Please tell me on BlueSky!
            </a>
        </p>
    </template>
</template>

<script setup lang="ts">
import type {
    ModuleReplacement,
    NativeModuleReplacement,
} from '~/types/module-manifests';

defineProps<{
    manifest: ModuleReplacement;
    documentation?: string | null;
}>();

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
[npmgraph](${formatNpmgraphUrl(mod)})
`;
}

function formatMDNUrl(mod: NativeModuleReplacement) {
    // Prevent XSS
    const path = mod.mdnPath.replaceAll(')', '\\)');

    return `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/${path}`;
}
function formatCaniuseUrl(mod: NativeModuleReplacement) {
    let query = mod.mdnPath;
    if (query.startsWith('Global_Objects/')) {
        query = query.slice(15);
    }
    query = query.replaceAll('/', ' ');

    return `https://caniuse.com/?search=${encodeURIComponent(query)}`;
}
function formatNpmgraphUrl(mod: NativeModuleReplacement) {
    return `https://npmgraph.js.org/?q=${encodeURIComponent(mod.moduleName)}`;
}
</script>
