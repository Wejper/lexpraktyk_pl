// Zdejmuje linki prowadzące do artykułów, które jeszcze nie wyszły.
//
// Publikowanie przyszłą datą zachęca do linkowania w przód: pisząc partię dziesięciu tekstów
// naraz, autor naturalnie odsyła do sąsiedniego, bo zna jego treść. Taki link jest poprawny
// w źródle i milczkiem oddaje 404 aż do dnia publikacji celu — w kolejce ogrzeje.pl było ich
// jednocześnie jedenaście, z rozjazdem sięgającym dwóch miesięcy.
//
// Zamiast pilnować tego ręcznie, link znika na czas budowania, a zdanie zostaje nietknięte.
// Codzienny przebudow (ten sam, który publikuje zaplanowane artykuły) włącza go z powrotem
// w dniu, w którym cel staje się dostępny. `npm run links:audit` nadal raportuje takie pary,
// bo autor powinien o nich wiedzieć — plugin chroni czytelnika, nie ukrywa problemu.

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ARTICLES_DIR = 'src/content/articles';

/** Slugi artykułów dostępnych w chwili budowania. Czytane raz, z dysku — treści nie ma
 *  jeszcze w żadnym API Astro w momencie, w którym działa remark. */
function publishedSlugs() {
  const today = new Date().toISOString().slice(0, 10);
  const live = new Set();
  for (const file of readdirSync(ARTICLES_DIR)) {
    if (!/\.mdx?$/.test(file)) continue;
    const fm = readFileSync(join(ARTICLES_DIR, file), 'utf-8').split('---')[1] ?? '';
    const date = fm.match(/publishDate:\s*([0-9-]+)/);
    const published = /published:\s*true/.test(fm);
    if (published && (!date || date[1] <= today)) live.add(file.replace(/\.mdx?$/, ''));
  }
  return live;
}

export function remarkDeferUnpublishedLinks() {
  const live = publishedSlugs();

  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type === 'link' && child.url?.startsWith('/artykuly/')) {
          const slug = decodeURIComponent(child.url.replace('/artykuly/', '').split(/[#?]/)[0]);
          if (!live.has(slug)) {
            // Podmiana węzła linku na jego własną treść — zdanie zostaje, znika tylko odnośnik.
            node.children.splice(i, 1, ...child.children);
            i += child.children.length - 1;
            continue;
          }
        }
        walk(child);
      }
    };
    walk(tree);
  };
}
