import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://pavittarx.github.io',
  base: '/system-design-guide',
  output: 'static',
  integrations: [mdx()],
  markdown: {
    smartypants: false,
    shikiConfig: {
      theme: 'dracula',
      wrap: true,
    },
  },
});
