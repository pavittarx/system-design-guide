import { visit } from 'unist-util-visit';

/**
 * Prefixes root-relative links with Astro's configured `base` so MDX can use
 * plain markdown links — [Load Balancing](/guides/load-balancing/) — without
 * hardcoding the deploy path. External links, anchors and mailto are left alone.
 */
export function rehypeBaseLinks({ base = '/' } = {}) {
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base;

  return (tree) => {
    if (!prefix) return;

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;

      const href = node.properties?.href;
      if (typeof href !== 'string') return;

      // Only root-relative paths. Skips //cdn.example.com, #anchor, https:, mailto:.
      if (!href.startsWith('/') || href.startsWith('//')) return;
      if (href.startsWith(prefix + '/')) return;

      node.properties.href = prefix + href;
    });
  };
}
