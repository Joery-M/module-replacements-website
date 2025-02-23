<template>
    <NuxtLink :href="props.href" :target="props.target ?? '_blank'">
        <slot />
    </NuxtLink>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

const props = defineProps({
    href: {
        type: String,
        default: '',
    },
    target: {
        type: String as PropType<
            | '_blank'
            | '_parent'
            | '_self'
            | '_top'
            | (string & object)
            | null
            | undefined
        >,
        default: undefined,
        required: false,
    },
});
</script>

<style lang="scss">
a:has(+ a) {
    margin-right: 0.5em;
}
</style>
