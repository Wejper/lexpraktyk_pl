// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkDeferUnpublishedLinks } from './src/plugins/remark-defer-unpublished-links.mjs';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://lexpraktyk.pl',

  // Konwencja mieszana: zbiory ze slashem (wyjątek robi wrapper w
  // server-start.mjs), dokumenty bez — patrz README, sekcja TODO/URL.
  trailingSlash: 'never',

  redirects: {
    // Jedyny slug z polskim znakiem. Adres bez slasha — ten, który był w sitemapie —
    // Astro przekierowywało na formę zakodowaną procentowo I ze slashem, wbrew
    // konwencji serwisu (dokumenty bez slasha). Google dostawało więc przekierowanie
    // na URL z sitemapy. Slug jest teraz ASCII, a obie stare formy przekierowują.
    '/artykuly/usunięcie-opinii-google-jak-to-zrobic': '/artykuly/usuniecie-opinii-google-jak-to-zrobic',
    '/artykuly/usuni%C4%99cie-opinii-google-jak-to-zrobic': '/artykuly/usuniecie-opinii-google-jak-to-zrobic',
  },
  // Linki do jeszcze nieopublikowanych artykułów znikają na czas budowania — patrz plugin.
  // mdx() dziedziczy konfigurację markdown, więc wystarczy jedno miejsce.
  markdown: {
    remarkPlugins: [remarkDeferUnpublishedLinks],
  },

  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()]
  },
  adapter: node({
    mode: 'standalone'
  })
});
