<template>
    <div :class="$props.class" class="codeblock-wrapper">
        <button
            class="copy"
            :class="{ copied: clipboard.copied.value }"
            title="Copy Code"
            @click="clipboard.copy(code)"
        >
            <span i-ph-clipboard></span>
        </button>
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
        @apply absolute right-2 top-2 p-0 flex justify-center items-center
            rounded-md border-none transition-all op-0 bg-tooltip outline-solid outline-color-primary outline-0;

        > span {
            @apply text-xl m-1.5 cursor-pointer bg-neutral-800 dark:bg-neutral-200;
        }
        &::after {
            @apply color-active absolute pointer-events-none left-50% top-52.5% translate--50% size-2.5 op-0 invisible transition i-ph-check-bold;
            content: '';
        }
        &.copied {
            > span {
                @apply bg-primary-600 dark:bg-primary-400 op-100;
            }
            &::after {
                @apply op-100 visible;
            }
        }
        &:focus-visible {
            @apply op-100 outline-solid outline-2 outline-color-primary;
        }
    }

    &:hover .copy {
        @apply op-100;
    }

    pre {
        // Extra right padding for copy button
        @apply m-0 of-x-auto bg-code rounded-lg py-3.5 pl-4 pr-12 my-7 text-sm;
    }
}
</style>
