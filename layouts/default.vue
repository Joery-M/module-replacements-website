<template>
    <div
        class="fixed top-0 h-14 w-full border-base b-solid b-0 b-b bg-neutral-100 dark:bg-neutral-900"
        role="banner"
        z-header
        flex
        items-center
    >
        <div flex-grow></div>
        <a
            aria-label="Module replacements GitHub repository"
            title="Module replacements GitHub repository"
            target="_blank"
            href="https://github.com/es-tooling/module-replacements"
            color-base!
            hover:color-active!
            transition-colors
            size-7
            mr-5
        >
            <span i-ph-github-logo size-full block></span>
        </a>
    </div>
    <div pt-14 pb-360px>
        <slot />
    </div>
</template>
