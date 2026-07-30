import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans:  ['Inter', ...defaultTheme.fontFamily.sans],
                serif: ['Playfair Display', ...defaultTheme.fontFamily.serif],
            },
            colors: {
                sirius: {
                    gold:           '#D4AF37',
                    'gold-light':   '#FAF6E8',
                    'gold-border':  '#EDE0A0',
                    dark:           '#1E1E1E',
                    'dark-2':       '#2a2a2a',
                    danger:         '#C62828',
                    'danger-light': '#FEF2F2',
                    'danger-border':'#FECACA',
                    success:        '#16A34A',
                    info:           '#2563EB',
                },
            },
            screens: {
                'xs': '475px',
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px',
            },
            borderRadius: {
                'xl':  '12px',
                '2xl': '16px',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },
        },
    },
    plugins: [],
}