import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/color-mode',
        '@nuxtjs/mdc',
        '@unocss/nuxt',
        '@vueuse/nuxt',
        'nitro-cloudflare-dev',
    ],
    devtools: {
        enabled: true,
    },
    compatibilityDate: '2024-11-01',

    nitro: {
        preset: 'cloudflare',
        plugins: ['plugins/run-task.ts'],
        experimental: {
            tasks: true,
        },
        storage: {
            'replacement-manifest': {
                driver: 'cloudflare-kv-binding',
                binding: 'replacement-manifest',
            },
            'replacement-docs': {
                driver: 'cloudflare-kv-binding',
                binding: 'replacement-docs',
            },
            fuse: {
                driver: 'cloudflare-kv-binding',
                binding: 'fuse',
            },
        },
        scheduledTasks: {
            // Run `fetch-manifests` every hour
            '0 * * * *': ['fetch-manifests'],
        },
    },

    mdc: {
        components: {
            prose: false,
            map: {
                pre: 'CodeBlock',
                code: 'Code',
                a: 'Anchor',
                script: 'ProseScript',
            },
        },
        highlight: {
            langs: ['js', 'ts', 'bash'],
            themes: ['vitesse-light', 'vitesse-dark'],
            // Forced by cloudflare
            shikiEngine: 'javascript',
        },
        rehypePlugins: {
            // Solves a tiny issue where anchor tags are squished together
            format: {
                src: import.meta.resolve('rehype-format'),
                options: {},
            },
        },
    },
    colorMode: {
        classSuffix: '',
    },
});
