import { defineMiddleware } from 'astro:middleware';

const WP_PATTERNS = [
  /^\/wp-content\//,
  /^\/wp-.*\.php/,
];

export const onRequest = defineMiddleware((context, next) => {
  const path = context.url.pathname;
  if (WP_PATTERNS.some(p => p.test(path))) {
    return new Response(null, { status: 410 });
  }
  return next();
});
