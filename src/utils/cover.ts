import fs from 'node:fs';
import path from 'node:path';

const UNSPLASH_KEY = import.meta.env.UNSPLASH_ACCESS_KEY;
const COVERS_DIR = path.resolve('public/images/covers');
const MANIFEST_PATH = path.join(COVERS_DIR, 'manifest.json');

function loadManifest(): Record<string, string> {
  if (fs.existsSync(MANIFEST_PATH)) {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  }
  return {};
}

function saveManifest(manifest: Record<string, string>) {
  fs.mkdirSync(COVERS_DIR, { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function toFilename(query: string, articleSlug?: string): string {
  const base = query.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  // Append article slug to make filename unique per article even with same query
  return articleSlug ? `${base}--${articleSlug}` : base;
}

export async function getCoverImage(cover?: string, tags?: string[], coverQuery?: string, articleSlug?: string): Promise<string> {
  if (cover) return cover;

  const query = coverQuery ?? (tags?.length ? tags[0] : 'heating home');

  // Check manifest first — reuse previously assigned filename for this article
  const manifest = loadManifest();
  const manifestKey = articleSlug ?? query;

  if (manifest[manifestKey]) {
    const cachedPath = path.join(COVERS_DIR, manifest[manifestKey]);
    if (fs.existsSync(cachedPath)) {
      return `/images/covers/${manifest[manifestKey]}`;
    }
  }

  const filename = `${toFilename(query, articleSlug)}.jpg`;
  const localPath = path.join(COVERS_DIR, filename);
  const publicPath = `/images/covers/${filename}`;

  if (UNSPLASH_KEY) {
    try {
      const apiRes = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${UNSPLASH_KEY}`
      );
      if (apiRes.ok) {
        const data = await apiRes.json();
        const imgRes = await fetch(data.urls.regular);
        if (imgRes.ok) {
          fs.mkdirSync(COVERS_DIR, { recursive: true });
          fs.writeFileSync(localPath, Buffer.from(await imgRes.arrayBuffer()));
          manifest[manifestKey] = filename;
          saveManifest(manifest);
          return publicPath;
        }
      }
    } catch {}
  }

  // Fallback
  return `https://picsum.photos/seed/${articleSlug ?? 'heating'}/800/450`;
}
