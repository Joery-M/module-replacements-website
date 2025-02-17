import { createConfigForNuxt } from '@nuxt/eslint-config';
import unocss from '@unocss/eslint-config/flat';
import tailwind from 'eslint-plugin-tailwindcss';
import prettier from 'eslint-plugin-prettier/recommended';

export default createConfigForNuxt({
    features: {
        typescript: true,
    },
})
    .append(unocss)
    .append(prettier)
    .overrideRules({
        'format/prettier': 'error',
        'vue/no-multiple-template-root': 'off',
    });
