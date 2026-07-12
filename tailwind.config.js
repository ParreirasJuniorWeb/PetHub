/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Paleta de cores - Pet Shop
                primary: {
                    DEFAULT: '#4A90A4',      // Azul suave (confiança)
                    dark: '#357A8C',        // Azul mais escuro
                    light: '#6BB3C4',       // Azul mais claro
                },
                secondary: {
                    DEFAULT: '#F4A261',     // Laranja vibrante (energia)
                    dark: '#E08B3D',        // Laranja escuro
                    light: '#F7B77D',       // Laranja claro
                },
                accent: {
                    DEFAULT: '#2EC4B6',     // Verde água (natureza)
                    dark: '#24A094',        // Verde mais escuro
                    light: '#5DD4C8',       // Verde mais claro
                },
                neutral: {
                    dark: '#1A1A2E',        // Quase preto
                    DEFAULT: '#2D2D44',     // Cinza escuro
                    light: '#F7F7F9',       // Cinza muito claro
                    lighter: '#FFFFFF',     // Branco
                }
            },
            fontFamily: {
                // Tipografia principal
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Poppins', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}