import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkDirective from 'remark-directive';
import { remarkPlaybookBlocks } from './src/plugins/remark-playbook-blocks.mjs';

export default defineConfig({
  site: 'https://theplaybookre.com',
  output: 'static',
  markdown: {
    remarkPlugins: [remarkDirective, remarkPlaybookBlocks],
  },
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
