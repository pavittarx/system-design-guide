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

/**
 * Guides split across several pages. Every other guide is one page. `path` is
 * the page's folder under the guide (empty for the guide's first page); the
 * sidebar, breadcrumb and previous/next links are all built from this list.
 */
export interface GuidePage { path: string; title: string; crumb: string }

const MULTI_PAGE: Partial<Record<GuideSlug, GuidePage[]>> = {
  'database-scaling': [
    { path: '', title: 'Overview: why the database breaks first', crumb: 'Overview' },
    { path: 'fast', title: 'Part 1: Make one box fast', crumb: 'Part 1' },
    { path: 'correct', title: 'Part 2: Keep it correct under load', crumb: 'Part 2' },
    { path: 'offload', title: 'Part 3: Take load off it', crumb: 'Part 3' },
    { path: 'split', title: 'Part 4: Split it', crumb: 'Part 4' },
    { path: 'recap', title: 'Recap and numbers', crumb: 'Recap' },
  ],
};

/** Section anchors from a guide's single-page era → the page that now holds them. */
export const LEGACY_ANCHORS: Partial<Record<GuideSlug, Record<string, string>>> = {
  'database-scaling': {
    'rule-zero': 'fast/#rule-zero', 'worked-index': 'fast/#rule-zero', queries: 'fast/#queries',
    transactions: 'correct/#transactions', migrations: 'correct/#migrations',
    avoid: 'offload/#avoid', replicas: 'offload/#replicas',
    partition: 'split/#sharding', sharding: 'split/#sharding', 'worked-shard': 'split/#worked-shard',
    cap: 'split/#beyond', managed: 'split/#beyond', beyond: 'split/#beyond',
    gotchas: 'split/#sharding', recap: 'recap/', reading: 'recap/',
  },
};

export const guidePages = (slug: GuideSlug): GuidePage[] =>
  MULTI_PAGE[slug] ?? [{ path: '', title: GUIDES[slug], crumb: '' }];

export const pageHref = (slug: GuideSlug, path: string) =>
  `${guideHref(slug)}${path ? `${path}/` : ''}`;
