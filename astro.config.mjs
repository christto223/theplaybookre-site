import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://theplaybookre.com',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/draft/'),
    }),
  ],
  build: {
    format: 'directory', // generates /lead-generation/article-slug/ (trailing slash)
  },
  trailingSlash: 'always',
  vite: {
    optimizeDeps: {
      // Skip slow node_modules scanning — improves local dev startup time
      noDiscovery: true,
      include: [],
    },
  },
});
