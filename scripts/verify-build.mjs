// Sanity checks for a finished build (run `npm run build` first).
//
//   - no <script> tags and no third-party URLs in any page
//   - draft posts are not published
//   - every internal link, image, stylesheet and font resolves to a file
//
// Usage: node scripts/verify-build.mjs [dist-directory]

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve(process.argv[2] ?? 'dist');
if (!existsSync(join(dist, 'index.html'))) {
  console.error(`verify-build: ${dist}/index.html not found. Run "npm run build" first.`);
  process.exit(1);
}

const errors = [];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const files = walk(dist);
const pages = files.filter((file) => file.endsWith('.html'));

// Where a root-relative URL path ends up on disk, or null if nothing serves it.
function resolveUrl(pathname) {
  const clean = decodeURIComponent(pathname.split('#')[0].split('?')[0]);
  const candidates = clean.endsWith('/')
    ? [join(dist, clean, 'index.html')]
    : [join(dist, clean), join(dist, clean, 'index.html')];
  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile()) ?? null;
}

const siteOrigin = (() => {
  const canonical = readFileSync(join(dist, 'index.html'), 'utf8').match(
    /<link rel="canonical" href="([^"]+)"/,
  );
  return canonical ? new URL(canonical[1]).origin : null;
})();

for (const page of pages) {
  const name = page.slice(dist.length + 1);
  const html = readFileSync(page, 'utf8');

  if (/<script[\s>]/i.test(html)) errors.push(`${name}: contains a <script> tag`);

  const references = [...html.matchAll(/\s(?:href|src)="([^"]*)"/g)].map((m) => m[1]);
  for (const ref of references) {
    if (/^(mailto:|tel:|#|data:)/.test(ref) || ref === '') continue;

    if (/^https?:\/\//.test(ref)) {
      const url = new URL(ref);
      if (siteOrigin && url.origin === siteOrigin) {
        if (!resolveUrl(url.pathname)) errors.push(`${name}: broken link ${ref}`);
      }
      continue;
    }

    if (ref.startsWith('//')) {
      errors.push(`${name}: protocol-relative URL ${ref}`);
      continue;
    }

    if (!ref.startsWith('/')) {
      errors.push(`${name}: relative link ${ref} (use root-relative URLs)`);
      continue;
    }

    if (!resolveUrl(ref)) errors.push(`${name}: broken link ${ref}`);
  }

  // Stylesheets and fonts must come from this site.
  for (const [, href] of html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)) {
    if (/^https?:\/\//.test(href) && new URL(href).origin !== siteOrigin) {
      errors.push(`${name}: third-party stylesheet ${href}`);
    }
  }
}

for (const css of files.filter((file) => file.endsWith('.css'))) {
  const name = css.slice(dist.length + 1);
  const content = readFileSync(css, 'utf8');
  for (const [, url] of content.matchAll(/url\(\s*["']?(https?:\/\/[^"')\s]+)/g)) {
    errors.push(`${name}: third-party resource ${url}`);
  }
}

// Drafts must never be published.
const contentDir = resolve('src/content/blog');
if (existsSync(contentDir)) {
  for (const file of readdirSync(contentDir).filter((f) => f.endsWith('.md'))) {
    const source = readFileSync(join(contentDir, file), 'utf8');
    const frontMatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    if (/^draft:\s*true\s*$/m.test(frontMatter)) {
      const slug = file.replace(/\.md$/, '');
      if (existsSync(join(dist, 'blog', slug))) errors.push(`draft "${slug}" was published`);
      const rss = existsSync(join(dist, 'rss.xml')) ? readFileSync(join(dist, 'rss.xml'), 'utf8') : '';
      if (rss.includes(`/blog/${slug}/`)) errors.push(`draft "${slug}" is in the RSS feed`);
    }
  }
}

for (const required of ['rss.xml', 'sitemap-index.xml', 'robots.txt', '404.html']) {
  if (!existsSync(join(dist, required))) errors.push(`missing ${required}`);
}

if (errors.length > 0) {
  console.error(`verify-build: ${errors.length} problem(s)\n`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`verify-build: ${pages.length} pages checked, no problems found.`);
