/**
 * Insight article metadata (main bundle: cards, routes, SEO). The full texts live in
 * articleBodies.ts, which only the lazily loaded article page imports.
 */
export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** ISO date first published on the site. */
  published: string;
  author: { name: string; role: string };
  /** Reading time in minutes (≈ words / 220). */
  minutes: number;
};

const AUTHOR = { name: 'Muhammad Rashid', role: 'Founder & CEO, KorvenzaTech' };

export const ARTICLES: Article[] = [
  {
    slug: 'how-businesses-can-integrate-ai-without-sacrificing-data-security',
    minutes: 5,
    title: 'How Businesses Can Integrate AI Without Sacrificing Data Security',
    description: 'A practical guide to adding AI assistants, document processing and automation to your business while keeping customer and company data under control.',
    category: 'AI & Automation',
    published: '2026-08-02',
    author: AUTHOR,
  },
  {
    slug: 'flutter-vs-native-apps-2026',
    minutes: 4,
    title: 'Flutter vs Native Apps in 2026: Choosing the Right Strategy for Your Business',
    description: 'When a single Flutter codebase is the right call, when native Swift and Kotlin still win, and how to decide for your product without guesswork.',
    category: 'App Development',
    published: '2026-07-18',
    author: AUTHOR,
  },
  {
    slug: 'api-first-approach-prevents-costly-rebuilds',
    minutes: 4,
    title: 'Why an API-First Approach Prevents Costly Software Rebuilds',
    description: 'How designing a clean API layer first lets one backend power your website, mobile apps, partners and AI features — without rebuilding when you grow.',
    category: 'Software Architecture',
    published: '2026-06-29',
    author: AUTHOR,
  },
];

export const articleBySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);
export const readMinutes = (a: Article) => a.minutes;
export const formatDate = (iso: string) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
