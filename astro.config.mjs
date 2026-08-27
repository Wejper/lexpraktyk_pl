// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://lexpraktyk.pl',

  // Konwencja mieszana: zbiory ze slashem (wyjątek robi wrapper w
  // server-start.mjs), dokumenty bez — patrz README, sekcja TODO/URL.
  trailingSlash: 'never',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()]
  },
  adapter: node({
    mode: 'standalone'
  })
});
