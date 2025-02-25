<template>
    <header
        class="fixed top-0 h-14 w-full border-base b-solid b-0 b-b bg-neutral-100 dark:bg-neutral-900"
        role="banner"
        z-header
        flex="~ justify-center"
    >
        <div flex="~ items-center" max-w-screen-2xl grow-1 mx-5>
            <img src="/icon.svg" size-7 alt="Module Replacements logo" />
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
            >
                <span i-ph-github-logo size-full block></span>
            </a>
        </div>
    </header>
    <div pt-14 pb-360px>
        <slot />
    </div>
</template>
