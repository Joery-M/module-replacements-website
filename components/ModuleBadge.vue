<template>
    <span
        v-if="module"
        badge
        :class="{
            'badge-documented': module.type === 'documented',
            'badge-native': module.type === 'native',
            'badge-none': module.type === 'none',
            'badge-simple': module.type === 'simple',
        }"
        :title="capitalize(module.type)"
    >
        <template v-if="module.type === 'documented'">DOC</template>
        <template v-else-if="module.type === 'native'">NAT</template>
        <template v-else-if="module.type === 'none'">UNKWN</template>
        <template v-else-if="module.type === 'simple'">SIM</template>
    </span>
</template>

<script lang="ts" setup>
import { capitalize } from 'vue';
import type { ModuleReplacement } from '~/types/module-manifests';

defineProps<{ module?: ModuleReplacement }>();
</script>
