import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter, sans-serif', { fontFeatureSettings: '"cv11"' }],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          DEFAULT: 'hsl(192, 70%, 28%)',
          hover: 'hsl(192, 70%, 34%)',
          light: 'hsl(192, 60%, 62%)',
          dim: 'hsla(192, 70%, 28%, 0.1)',
          50: 'hsl(192, 70%, 96%)',
          100: 'hsl(192, 70%, 90%)',
          200: 'hsl(192, 70%, 78%)',
          300: 'hsl(192, 70%, 62%)',
          400: 'hsl(192, 70%, 48%)',
          500: 'hsl(192, 70%, 38%)',
          600: 'hsl(192, 70%, 28%)',
          700: 'hsl(192, 70%, 22%)',
          800: 'hsl(192, 70%, 16%)',
          900: 'hsl(192, 70%, 10%)',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8D5A3',
          dim: 'rgba(201,168,76,0.15)',
        },
        pub: {
          bg: '#0A0A0A',
          bg2: '#111111',
          bg3: '#1A1A1A',
          border: '#2A2A2A',
          text: '#F0EDE8',
          dim: '#9A9490',
          muted: '#5A5550',
        },
        sidebar: {
          DEFAULT: 'hsl(215, 28%, 17%)',
          fg: 'hsl(210, 40%, 98%)',
          muted: 'hsl(215, 16%, 50%)',
          border: 'hsla(255, 255%, 255%, 0.06)',
        },
      },
    },
  },
  plugins: [],
}

export default config
