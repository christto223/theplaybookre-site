import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

// Only activate the Netlify adapter during Netlify builds, not local dev
const isNetlify = !!process.env.NETLIFY;

export default defineConfig({
  site: 'https://theplaybookre.com',
  output: 'static',
  adapter: isNetlify ? netlify() : undefined,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/draft/'),
    }),
  ],
  build: {
    format: 'directory', // generates /lead-generation/article-slug/ (trailing slash)
  },
  trailingSlash: 'always',
});
