import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { rehypeAlerts } from './src/plugins/rehype-alerts.mjs';

// The public URL of the site. Override it at build time with SITE_URL.
const site = process.env.SITE_URL || 'https://demo.mikrus.dev';

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
  markdown: {
    // The unified (remark/rehype) processor is needed for the alerts plugin.
    processor: unified({ rehypePlugins: [rehypeAlerts] }),
    shikiConfig: {
      themes: { light: 'solarized-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
      wrap: true,
    },
  },
});
