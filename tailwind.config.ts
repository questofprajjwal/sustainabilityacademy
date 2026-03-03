import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.ts',
    './src/content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
