const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
        "./node_modules/tw-elements/dist/js/**/*.js"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    darkMode: 'class',
    plugins: [
        require('@tailwindcss/forms'),
        require("tw-elements/dist/plugin.cjs")
    ]
}
