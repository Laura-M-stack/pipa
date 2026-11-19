/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Published on GitHub Pages as a project site: https://laura-m-stack.github.io/pipa/
export default defineConfig({
  plugins: [svelte()],
  base: '/pipa/',
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
