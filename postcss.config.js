// Tailwind v4 is handled entirely by @tailwindcss/vite plugin.
// This file intentionally overrides the parent repo's postcss.config.js
// which runs Tailwind v3 and would conflict with v4.
export default {
  plugins: {
    autoprefixer: {},
  },
};
