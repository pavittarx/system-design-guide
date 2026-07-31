import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { rehypeBaseLinks } from './src/lib/rehype-base-links.mjs';
import { remarkTrace } from './src/lib/remark-trace.mjs';

const base = '/system-design-guide';

// Note: the pre-Astro site served each guide as a flat `<slug>.html` file at the
// root. Those URLs are public and indexed, so `public/*.html` holds a redirect
// stub for each one. They live in public/ rather than Astro's `redirects` config
// because that config emits `<slug>.html/index.html` directories, which do not
// serve reliably at the original URL on GitHub Pages.

// https://astro.build/config
export default defineConfig({
  site: 'https://pavittarx.github.io',
  base,
  output: 'static',
  integrations: [mdx()],
  markdown: {
    smartypants: false,
    remarkPlugins: [remarkTrace],
    rehypePlugins: [[rehypeBaseLinks, { base }]],
    shikiConfig: {
      theme: 'dracula',
      wrap: true,
    },
  },
});
