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

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const guideHref = (slug: GuideSlug) => `${base}/guides/${slug}/`;

export const guideTitle = (slug: GuideSlug) => GUIDES[slug];
