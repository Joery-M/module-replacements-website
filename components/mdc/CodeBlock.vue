<template>
    <div :class="$props.class" class="codeblock-wrapper">
        <div class="copy" :class="{ copied: clipboard.copied.value }">
            <button
                @click="clipboard.copy(code)"
                title="Copy Code"
                i-ph-clipboard
            />
        </div>
        <pre class="codeblock"><slot /></pre>
    </div>
</template>

<script setup lang="ts">
defineProps({
    code: {
        type: String,
        default: '',
    },
    language: {
        type: String,
        default: null,
    },
    filename: {
        type: String,
        default: null,
    },
    highlights: {
        type: Array as () => number[],
        default: () => [],
    },
    meta: {
        type: String,
        default: null,
    },
    class: {
        type: String,
        default: null,
    },
});

const clipboard = useClipboard();
</script>

<style lang="scss" scoped>
.codeblock-wrapper {
    @apply relative;
    .copy {
        @apply bg-tooltip op-0 absolute right-4 top-4 transition-opacity flex justify-center items-center rounded-md transition-colors;
        button {
            @apply text-xl m-1.5 cursor-pointer;
        }
        &::after {
            @apply absolute pointer-events-none left-50% top-52.5% translate--50% size-2.5 op-0 invisible transition i-ph-check-bold;
            content: '';
        }
        &.copied {
            @apply color-active;
            &::after {
                @apply op-100 visible;
            }
        }
    }

    &:hover .copy,
    .copy:focus-visible {
        @apply op-100;
    }

    pre {
        @apply m-0 of-x-auto bg-code rounded-lg py-3.5 px-4 my-7 text-sm;
    }
}
</style>
