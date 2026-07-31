/**
 * Canonical slug → title map for the twelve guides.
 *
 * Frontmatter refers to sibling guides by slug (`series.guides: [consistency-cap]`)
 * so titles and URLs live in exactly one place.
 */
export const GUIDES = {
  'understanding-caching': 'Understanding Caching',
  'database-scaling': 'Scaling Databases',
  'load-balancing': 'Load Balancing',
  'message-queues': 'Message Queues & Async',
  'reliability-toolkit': 'The Reliability Toolkit',
  'consistency-cap': 'Consistency & CAP',
  observability: 'Seeing Inside the Machine',
  'api-gateways': 'APIs, Gateways & Rate Limiting',
  'cdn-edge': 'CDNs & the Edge',
  'coordination-consensus': 'Getting Machines to Agree',
  'real-time-systems': 'Systems That Push Back',
  'design-the-checkout': 'Design the Checkout',
} as const;

export type GuideSlug = keyof typeof GUIDES;

// BASE_URL carries no trailing slash here, so always build hrefs through these
// helpers — `${BASE_URL}guides/x` silently produces /system-design-guideguides/x.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Site-root-relative href, e.g. withBase('system-design-basics-complete/'). */
export const withBase = (path = '') => `${base}/${path.replace(/^\//, '')}`;

export const guideHref = (slug: GuideSlug) => `${base}/guides/${slug}/`;

export const guideTitle = (slug: GuideSlug) => GUIDES[slug];
