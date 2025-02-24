import {
    defineConfig,
    presetUno,
    presetIcons,
    presetAttributify,
    presetWebFonts,
    transformerDirectives,
    transformerVariantGroup,
    parseVariantGroup,
    escapeRegExp,
    type VariantObject,
} from 'unocss';

function variantParentMatcher<T extends object = object>(
    name: string,
    parent: string,
): VariantObject<T> {
    let re: RegExp;
    return {
        name,
        match(input, ctx) {
            if (!re)
                re = new RegExp(
                    `^${escapeRegExp(name)}(?:${ctx.generator.config.separators.join('|')})`,
                );

            const match = input.match(re);
            if (match) {
                return {
                    matcher: input.slice(match[0].length),
                    handle: (input, next) =>
                        next({
                            ...input,
                            parent: `${input.parent ? `${input.parent} $$ ` : ''}${parent}`,
                        }),
                };
            }
        },
        autocomplete: `${name}:`,
    };
}

export default defineConfig({
    shortcuts: [
        {
            'color-base': 'color-neutral-800 dark:color-neutral-200',
            'bg-base': 'bg-neutral-50 dark:bg-#1b1b1b',
            'bg-secondary': 'bg-neutral-200 dark:bg-#222',
            'border-base':
                'light:(border-neutral-300 contrast:border-neutral-700) dark:(border-neutral-700 contrast:border-neutral-3)',

            'bg-tooltip': 'bg-neutral-50:75 dark:bg-#1b1b1b:75 backdrop-blur-8',
            'bg-code': 'bg-gray5:15',

            'color-active':
                'color-primary-600 contrast:color-amber-700 dark:color-primary-400',
            'border-active': 'border-primary-600/25 dark:border-primary-400/25',
            'bg-active': 'bg-#8884',

            'btn-action':
                'border border-base rounded flex gap-2 items-center px2 py1 op75 hover:op100 hover:bg-active disabled:pointer-events-none disabled:op30!',
            'btn-action-sm': 'btn-action text-sm',
            'btn-action-active': 'color-active border-active! bg-active op100!',

            badge: 'color-light min-w-7 text-center px-1 py-0.5 inline-block text-0.75em line-height-4 rounded-md uppercase',

            'badge-documented': 'badge bg-green-700',
            'badge-native': 'badge bg-yellow-700',
            'badge-none': 'badge bg-neutral-600',
            'badge-simple': 'badge bg-cyan-700',

            'z-overlay': 'z-40',
            'z-header': 'z-50',
            'z-header-overlay': 'z-60',
        },
    ],
    variants: [
        variantParentMatcher('contrast', '@media (prefers-contrast: more)'),
    ],
    theme: {
        media: {
            more_contrast: '(prefers-contrast: more)',
        },
        colors: {
            primary: {
                50: '#FDF6E4',
                100: '#FBF0D1',
                200: '#F8E3AB',
                300: '#F5D786',
                400: '#F2CA60',
                500: '#EEB92C',
                DEFAULT: '#EEB92C',
                600: '#D19C11',
                700: '#9D750D',
                800: '#694F09',
                900: '#352804',
                950: '#1B1402',
            },
        },
    },
    presets: [
        presetUno(),
        presetIcons(),
        presetAttributify(),
        presetWebFonts({
            fonts: {
                sans: 'DM Sans:200,400,700',
                mono: 'DM Mono',
            },
        }),
    ],
    transformers: [transformerVariantGroup(), transformerDirectives()],
});
