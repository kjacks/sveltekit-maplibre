import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  // define aliases
  resolve: {
    alias: {
      $lib: '/src/lib',
    },
  },
};

export default config;
