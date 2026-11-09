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
  'understanding-caching': [
    { path: '', title: "Overview: what a cache is and where it lives", crumb: 'Overview' },
    { path: 'patterns', title: "Part 1: Read and write patterns", crumb: 'Part 1' },
    { path: 'failure', title: "Part 2: Eviction, stampedes and hot keys", crumb: 'Part 2' },
    { path: 'production', title: "Part 3: Caching in production", crumb: 'Part 3' },
    { path: 'lab', title: "Part 4: Hands-on lab", crumb: 'Part 4' },
    { path: 'recap', title: "Recap and cheat sheet", crumb: 'Recap' },
  ],
  'load-balancing': [
    { path: '', title: "Overview: why one server isn't enough", crumb: 'Overview' },
    { path: 'layers', title: "Part 1: Layers and algorithms", crumb: 'Part 1' },
    { path: 'health', title: "Part 2: Health, state and autoscaling", crumb: 'Part 2' },
    { path: 'failure', title: "Part 3: How it breaks", crumb: 'Part 3' },
    { path: 'recap', title: "Recap and numbers", crumb: 'Recap' },
  ],
  'message-queues': [
    { path: '', title: "Overview: async and the queue as a shock absorber", crumb: 'Overview' },
    { path: 'delivery', title: "Part 1: Delivery and idempotency", crumb: 'Part 1' },
    { path: 'ordering', title: "Part 2: Ordering, dead letters and the outbox", crumb: 'Part 2' },
    { path: 'running', title: "Part 3: Running queues", crumb: 'Part 3' },
    { path: 'recap', title: "Recap", crumb: 'Recap' },
  ],
  'reliability-toolkit': [
    { path: '', title: "Overview: the uncomfortable truth", crumb: 'Overview' },
    { path: 'timeouts', title: "Part 1: Timeouts and retries", crumb: 'Part 1' },
    { path: 'containment', title: "Part 2: Breakers, bulkheads and degradation", crumb: 'Part 2' },
    { path: 'practice', title: "Part 3: Putting it together", crumb: 'Part 3' },
    { path: 'recap', title: "Recap and numbers", crumb: 'Recap' },
  ],
  'consistency-cap': [
    { path: '', title: "Overview: what consistency means", crumb: 'Overview' },
    { path: 'spectrum', title: "Part 1: The spectrum and quorums", crumb: 'Part 1' },
    { path: 'conflicts', title: "Part 2: Conflicts and fencing", crumb: 'Part 2' },
    { path: 'transactions', title: "Part 3: Transactions and read-your-writes", crumb: 'Part 3' },
    { path: 'recap', title: "Recap and numbers", crumb: 'Recap' },
  ],
  'observability': [
    { path: '', title: "Overview: green dashboards, broken system", crumb: 'Overview' },
    { path: 'metrics', title: "Part 1: Metrics", crumb: 'Part 1' },
    { path: 'logs-traces', title: "Part 2: Logs, traces and cardinality", crumb: 'Part 2' },
    { path: 'slos', title: "Part 3: SLOs and alerting", crumb: 'Part 3' },
    { path: 'practice', title: "Part 4: In practice", crumb: 'Part 4' },
    { path: 'recap', title: "Recap", crumb: 'Recap' },
  ],
  'api-gateways': [
    { path: '', title: "Overview: the API is the product", crumb: 'Overview' },
    { path: 'contract', title: "Part 1: Designing the contract", crumb: 'Part 1' },
    { path: 'rate-limiting', title: "Part 2: Gateways and rate limiting", crumb: 'Part 2' },
    { path: 'in-practice', title: "Part 3: Limits in practice and auth", crumb: 'Part 3' },
    { path: 'recap', title: "Recap", crumb: 'Recap' },
  ],
  'cdn-edge': [
    { path: '', title: "Overview: distance is a physics problem", crumb: 'Overview' },
    { path: 'caching', title: "Part 1: What to cache and how", crumb: 'Part 1' },
    { path: 'freshness', title: "Part 2: Purging and serving stale", crumb: 'Part 2' },
    { path: 'edge', title: "Part 3: TLS, edge compute and failure", crumb: 'Part 3' },
    { path: 'recap', title: "Recap", crumb: 'Recap' },
  ],
  'coordination-consensus': [
    { path: '', title: "Overview: why agreement is hard", crumb: 'Overview' },
    { path: 'raft', title: "Part 1: Raft and quorums", crumb: 'Part 1' },
    { path: 'safety', title: "Part 2: Split brain, locks and leases", crumb: 'Part 2' },
    { path: 'practice', title: "Part 3: In practice", crumb: 'Part 3' },
    { path: 'recap', title: "Recap", crumb: 'Recap' },
  ],
  'real-time-systems': [
    { path: '', title: "Overview: the inversion", crumb: 'Overview' },
    { path: 'connections', title: "Part 1: Connections, routing and fan-out", crumb: 'Part 1' },
    { path: 'delivery', title: "Part 2: Presence and ordering", crumb: 'Part 2' },
    { path: 'failure', title: "Part 3: Reconnects and backpressure", crumb: 'Part 3' },
    { path: 'recap', title: "Recap", crumb: 'Recap' },
  ],
  'design-the-checkout': [
    { path: '', title: "Overview: the brief, in numbers", crumb: 'Overview' },
    { path: 'design', title: "Part 1: From naive to forced moves", crumb: 'Part 1' },
    { path: 'correctness', title: "Part 2: Events, guardrails and staleness", crumb: 'Part 2' },
    { path: 'trace', title: "Part 3: Trace it, break it", crumb: 'Part 3' },
    { path: 'recap', title: "Recap and numbers", crumb: 'Recap' },
  ],
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
  'understanding-caching': {"strategies": "patterns/#strategies", "worked": "patterns/#worked", "bugs": "patterns/#bugs", "eviction": "failure/#eviction", "stampede": "failure/#stampede", "metastable": "failure/#metastable", "hotkeys": "failure/#hotkeys", "http": "production/#http", "ops": "production/#ops", "dont": "production/#dont", "metrics": "production/#metrics", "lab": "lab/#lab", "recap": "recap/"},
  'load-balancing': {"l4l7": "layers/#l4l7", "pick-a-layer": "layers/#pick-a-layer", "algos": "layers/#algos", "health": "health/#health", "sticky": "health/#sticky", "auto": "health/#auto", "gotchas": "failure/#gotchas", "cascade": "failure/#cascade", "recap": "recap/", "draining": "failure/#draining", "liveness-readiness": "failure/#liveness-readiness", "fail-open": "failure/#fail-open", "slow-start": "failure/#slow-start", "keepalive-l4": "failure/#keepalive-l4", "client-ip": "failure/#client-ip", "retry-amplification": "failure/#retry-amplification", "p2c": "failure/#p2c", "death-spiral": "failure/#death-spiral", "cascade-mechanisms": "failure/#cascade-mechanisms"},
  'message-queues': {"delivery": "delivery/#delivery", "idem": "delivery/#idem", "visibility": "delivery/#visibility", "order": "ordering/#order", "outbox": "ordering/#outbox", "gotchas": "running/#gotchas", "numbers": "running/#numbers", "tools": "running/#tools", "recap": "recap/"},
  'reliability-toolkit': {"timeouts": "timeouts/#timeouts", "retries": "timeouts/#retries", "breakers": "containment/#breakers", "bulkheads": "containment/#bulkheads", "degrade": "containment/#degrade", "which-wall": "practice/#which-wall", "arithmetic": "practice/#arithmetic", "gotchas": "practice/#gotchas", "chaos": "practice/#chaos", "recap": "recap/"},
  'consistency-cap': {"spectrum": "spectrum/#spectrum", "quorum": "spectrum/#quorum", "trace": "spectrum/#trace", "conflicts": "conflicts/#conflicts", "fencing": "conflicts/#fencing", "txn": "transactions/#txn", "ryw": "transactions/#ryw", "recap": "recap/"},
  'observability': {"metrics": "metrics/#metrics", "average": "metrics/#average", "red-use": "metrics/#red-use", "logs": "logs-traces/#logs", "traces": "logs-traces/#traces", "cardinality": "logs-traces/#cardinality", "slo": "slos/#slo", "alerting": "slos/#alerting", "incident": "practice/#incident", "gotchas": "practice/#gotchas", "recap": "recap/"},
  'api-gateways': {"versioning": "contract/#versioning", "pagination": "contract/#pagination", "errors": "contract/#errors", "gateway": "rate-limiting/#gateway", "algorithms": "rate-limiting/#algorithms", "distributed": "rate-limiting/#distributed", "keys": "in-practice/#keys", "429": "in-practice/#429", "auth": "in-practice/#auth", "gotchas": "in-practice/#gotchas", "recap": "recap/"},
  'cdn-edge': {"cacheable": "caching/#cacheable", "cachekey": "caching/#cachekey", "shield": "caching/#shield", "purge": "freshness/#purge", "stale": "freshness/#stale", "tls": "edge/#tls", "compute": "edge/#compute", "failure": "edge/#failure", "gotchas": "edge/#gotchas", "recap": "recap/"},
  'coordination-consensus': {"raft": "raft/#raft", "quorum": "raft/#quorum", "split": "safety/#split", "locks": "safety/#locks", "leases": "safety/#leases", "stores": "practice/#stores", "patterns": "practice/#patterns", "avoid": "practice/#avoid", "gotchas": "practice/#gotchas", "recap": "recap/"},
  'real-time-systems': {"cost": "connections/#cost", "routing": "connections/#routing", "fanout": "connections/#fanout", "presence": "delivery/#presence", "ordering": "delivery/#ordering", "reconnect": "failure/#reconnect", "backpressure": "failure/#backpressure", "gotchas": "failure/#gotchas", "recap": "recap/"},
  'design-the-checkout': {"naive": "design/#naive", "moves": "design/#moves", "notshard": "design/#notshard", "inseparable": "correctness/#inseparable", "guardrails": "correctness/#guardrails", "staleness": "correctness/#staleness", "trace": "trace/#trace", "break": "trace/#break", "only-if": "trace/#only-if", "recap": "recap/"},
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
