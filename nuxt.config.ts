import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@unocss/nuxt', '@vueuse/nuxt'],
    devtools: { enabled: true },
    compatibilityDate: '2024-11-01',

    nitro: {
        experimental: {
            tasks: true,
        },
        storage: {
            'replacement-manifest': { driver: 'fs-lite', base: './data/db' },
        },
        scheduledTasks: {
            // Run `fetch-manifests` every hour
            '0 * * * *': ['fetch-manifests'],
        },
    },
});
