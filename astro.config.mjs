import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { rehypeAlerts } from './src/plugins/rehype-alerts.mjs';
import { rehypeWrapTables } from './src/plugins/rehype-wrap-tables.mjs';

// The public URL of the site, used for canonical links, the RSS feed, the
// sitemap and robots.txt. Set it when you build:
//
//   SITE_URL=https://example.com npm run build
//
const site = process.env.SITE_URL || 'http://localhost:4321';

if (!process.env.SITE_URL && process.argv.includes('build')) {
  console.warn(
    '\n[plain-blog] SITE_URL is not set, so canonical links, the RSS feed and the sitemap\n' +
      `point at ${site}. Build with SITE_URL=https://your-domain npm run build.\n`,
  );
}

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
  markdown: {
    // The unified (remark/rehype) processor is needed for the custom plugins.
    processor: unified({ rehypePlugins: [rehypeAlerts, rehypeWrapTables] }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
      wrap: true,
    },
  },
});
