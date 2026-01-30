// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,vue,svelte}",
        // Add all other paths to your template files here
    ],
    theme: {
        extend: {},
    },
    plugins: [
        '@toolwind/corner-shape'
    ],
};