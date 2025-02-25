<template>
    <header
        class="fixed top-0 h-14 w-full border-base b-solid b-0 b-b bg-neutral-100 dark:bg-neutral-900"
        role="banner"
        z-header
        flex="~ justify-center"
    >
        <div flex="~ items-center grow" max-w-screen-2xl mx-5>
            <span
                i-local-logo
                size-7
                role="img"
                aria-label="Module Replacements logo"
                color-active
            />
            <div flex-grow></div>
            <a
                aria-label="Module replacements GitHub repository"
                title="Module replacements GitHub repository"
                target="_blank"
                href="https://github.com/es-tooling/module-replacements"
                class="link-icon"
                size-7
            >
                <span i-ph-github-logo size-full block></span>
            </a>
        </div>
    </header>
    <div pt-14 pb-36 min-h-100dvh>
        <slot />
    </div>
    <footer
        flex="~ justify-center"
        z-header
        h-10
        bg-neutral-100
        dark:bg-neutral-900
    >
        <div flex="~ items-center grow gap-2" max-w-screen-2xl mx-5>
            <p text-sm text-neutral>
                This site is a visualization of the data provided by
                <a
                    href="https://e18e.dev/"
                    target="_blank"
                    class="decoration-none color-dark! dark:color-light!"
                >
                    e18e
                </a>
                and has no direct affiliation with the e18e initiative.
            </p>
            <div flex-grow></div>
            <a
                aria-label="Joery's Bluesky page"
                title="Joery's Bluesky page"
                target="_blank"
                href="https://bsky.app/profile/joery.com"
                class="link-icon"
                size-5
            >
                <span i-local-bluesky size-full block></span>
            </a>
            <a
                aria-label="Website GitHub repository"
                title="Website GitHub repository"
                target="_blank"
                href="https://github.com/Joery-M/module-replacements-website"
                class="link-icon"
                size-5
            >
                <span i-ph-github-logo-fill size-full block></span>
            </a>
        </div>
    </footer>
</template>

<style lang="scss" scoped>
.link-icon {
    @apply color-base! hover:color-active! transition-colors;
}
</style>
