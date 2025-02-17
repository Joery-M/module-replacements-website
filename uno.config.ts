import {
    defineConfig,
    presetUno,
    presetIcons,
    presetAttributify,
    presetWebFonts,
    transformerDirectives,
    transformerVariantGroup,
} from 'unocss';

export default defineConfig({
    shortcuts: [
        {
            'color-base': 'color-neutral-800 dark:color-neutral-200',
            'bg-base': 'bg-neutral-50 dark:bg-#1b1b1b',
            'bg-secondary': 'bg-neutral-100 dark:bg-#222',
            'border-base': 'border-neutral-300 dark:border-neutral-700',

            'bg-tooltip': 'bg-neutral-50:75 dark:bg-#1b1b1b:75 backdrop-blur-8',
            'bg-code': 'bg-gray5:5',

            'color-active': 'color-primary-600 dark:color-primary-400',
            'border-active': 'border-primary-600/25 dark:border-primary-400/25',
            'bg-active': 'bg-#8881',

            'btn-action':
                'border border-base rounded flex gap-2 items-center px2 py1 op75 hover:op100 hover:bg-active disabled:pointer-events-none disabled:op30!',
            'btn-action-sm': 'btn-action text-sm',
            'btn-action-active': 'color-active border-active! bg-active op100!',

            'z-overlay': 'z-40',
            'z-header': 'z-50',
            'z-header-overlay': 'z-60',
        },
        [
            /^bg-glass(:\d+)?$/,
            ([, perc = ':75']) =>
                `bg-neutral-100${perc} dark:bg-#222${perc} backdrop-blur-5`,
        ],
    ],
    theme: {
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
