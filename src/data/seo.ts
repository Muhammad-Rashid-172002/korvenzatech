/**
 * Single source of truth for page metadata and structured data.
 * Used by the client (SeoManager, on client-side navigation) and by the
 * build-time prerenderer (scripts/generate-seo-pages.mjs) so both always agree.
 * Only verified company information is used here.
 */
import { CASE_STUDIES, FAQ_ITEMS, SERVICES_DATA } from './companyData';
import { ARTICLES } from './articles';
import { LEGAL } from './legal';

export const SITE = 'https://korvenzatech.com';
export const OG_IMAGE = `${SITE}/og-cover.png`;

export type RouteMeta = {
  path: string;
  title: string;
  description: string;
  /** Visible page name used for breadcrumbs. */
  name: string;
  keywords?: string;
  ogType: 'website' | 'article';
  image: string;
  imageWidth: number;
  imageHeight: number;
  noindex?: boolean;
  changefreq: 'weekly' | 'monthly';
  priority: number;
};

const SERVICE_META: Record<string, [string, string]> = {
  'ai-solutions': ['AI Development & Business Automation Services | KorvenzaTech', 'AI assistants, private knowledge systems, workflow automation, document intelligence and multimodal product features designed around real business operations.'],
  'api-development': ['Custom API Development & Integration Services | KorvenzaTech', 'Secure custom APIs, backend integrations, webhooks and connected software systems for mobile apps, websites, SaaS products and business platforms.'],
  'mobile-app-development': ['Mobile App Development | Flutter, iOS & Android | KorvenzaTech', 'Professional mobile app development for Android and iOS, including Flutter apps, cloud backends, notifications, maps, payments and scalable product engineering.'],
  'web-development': ['Website & Web App Development Services | KorvenzaTech', 'Modern corporate websites, SaaS websites, web applications and conversion-focused digital experiences with responsive engineering and technical SEO.'],
  'custom-software': ['Custom Software Development Services | KorvenzaTech', 'Custom business software, internal platforms, dashboards, workflow systems, CRM/ERP solutions and operational tools built around your process.'],
  'saas-development': ['SaaS Development & Product Engineering | KorvenzaTech', 'End-to-end SaaS development for MVPs and scalable products, including subscriptions, user workspaces, dashboards, APIs, cloud backends and admin systems.'],
  'cloud-solutions': ['Cloud & Backend Development Services | KorvenzaTech', 'Cloud-ready backends, databases, authentication, storage, serverless systems, deployment and scalable infrastructure for modern digital products.'],
  'ui-ux-design': ['UI/UX Design for Apps, SaaS & Websites | KorvenzaTech', 'Product-focused UI/UX design for mobile apps, SaaS platforms, websites and dashboards with clear user flows and maintainable design systems.'],
  'digital-marketing': ['Technical SEO & Digital Growth Strategy | KorvenzaTech', 'Technical SEO, analytics, conversion optimization and digital growth strategy aligned with modern websites, software products and technology businesses.'],
};

const STUDY_META: Record<string, [string, string]> = {
  'ielts-ai-master': ['IELTS AI Master Case Study | KorvenzaTech', 'AI-powered education product case study covering speaking, writing, reading and listening workflows, Firebase architecture and mobile product delivery.'],
  skilllink: ['SkillLink Marketplace Case Study | KorvenzaTech', 'On-demand services marketplace case study covering customer and worker flows, real-time job lifecycle, Firebase architecture and Google Maps integration.'],
};

const STUDY_IMAGES: Record<string, string> = {
  'ielts-ai-master': '/media/work/ielts-ai-master-1536.webp',
  skilllink: '/media/work/skilllink-1536.webp',
};

const STATIC: Record<string, { title: string; description: string; name: string; keywords?: string; changefreq: 'weekly' | 'monthly'; priority: number }> = {
  '/': {
    title: 'KorvenzaTech | Software Development, AI, SaaS, Mobile & Web',
    description: 'Software development company building custom software, SaaS platforms, AI solutions, Flutter mobile apps, websites, APIs and cloud systems for growing businesses.',
    name: 'Home',
    changefreq: 'weekly', priority: 1.0,
  },
  '/services': { title: 'Software Development Services: AI, SaaS, Apps & APIs | KorvenzaTech', description: 'Explore KorvenzaTech services across AI solutions, SaaS, custom software, mobile apps, websites, APIs, cloud infrastructure, UI/UX and digital growth.', name: 'Services', changefreq: 'weekly', priority: 0.9 },
  '/work': { title: 'Software Case Studies & Solution Blueprints | KorvenzaTech', description: 'Explore selected KorvenzaTech products and solution blueprints across education technology, marketplaces, AI, SaaS, APIs, cloud and product design.', name: 'Work', changefreq: 'weekly', priority: 0.8 },
  '/industries': { title: 'Industry Software Solutions | KorvenzaTech', description: 'Software and digital product solutions for healthcare, education, finance, e-commerce, logistics, real estate, marketplaces and professional services.', name: 'Industries', changefreq: 'monthly', priority: 0.7 },
  '/about': { title: 'About KorvenzaTech | Software Engineering & Product Company', description: 'Learn about KorvenzaTech, our leadership, engineering philosophy, client-focused delivery model and approach to building modern digital products.', name: 'About', changefreq: 'monthly', priority: 0.7 },
  '/insights': { title: 'Software, AI, SaaS & App Development Insights | KorvenzaTech', description: 'Practical guidance on AI, SaaS products, mobile apps, APIs, cloud systems, product architecture and digital growth.', name: 'Insights', changefreq: 'weekly', priority: 0.7 },
  '/careers': { title: 'Technology Careers | KorvenzaTech', description: 'Explore engineering, product, design and growth opportunities at KorvenzaTech when roles are available.', name: 'Careers', changefreq: 'monthly', priority: 0.5 },
  '/contact': { title: 'Contact KorvenzaTech | Software, AI & Product Enquiries', description: 'Contact KorvenzaTech for general enquiries, project and sales discussions, partnerships, WhatsApp follow-up and software development consultations.', name: 'Contact', changefreq: 'monthly', priority: 0.8 },
  '/start-project': { title: 'Start a Software, AI, SaaS or App Project | KorvenzaTech', description: 'Share your product idea or business goal with KorvenzaTech and get a clear path for custom software, SaaS, AI, mobile, web, API or cloud development.', name: 'Start a Project', changefreq: 'monthly', priority: 0.8 },
};

for (const d of LEGAL) STATIC[`/${d.slug}`] = { title: `${d.title} | KorvenzaTech`, description: d.description, name: d.title, changefreq: 'monthly', priority: 0.3 };

/** Every indexable route, in sitemap order. */
export const ROUTES: string[] = [
  ...Object.keys(STATIC),
  ...ARTICLES.map((a) => `/insights/${a.slug}`),
  ...CASE_STUDIES.map((c) => `/work/${c.id}`),
  ...SERVICES_DATA.map((s) => `/services/${s.id}`),
];

const base = { ogType: 'website' as const, image: OG_IMAGE, imageWidth: 1200, imageHeight: 630 };

export function getRouteMeta(path: string): RouteMeta {
  const s = STATIC[path];
  if (s) return { ...base, path, ...s };

  const service = path.startsWith('/services/') ? SERVICES_DATA.find((x) => `/services/${x.id}` === path) : undefined;
  if (service) {
    const [title, description] = SERVICE_META[service.id] ?? [`${service.title} Services | KorvenzaTech`, service.shortDesc];
    return { ...base, path, title, description, name: service.title, changefreq: 'monthly', priority: 0.9 };
  }

  const article = path.startsWith('/insights/') ? ARTICLES.find((a) => `/insights/${a.slug}` === path) : undefined;
  if (article) return { ...base, path, title: `${article.title} | KorvenzaTech`, description: article.description, name: article.title, ogType: 'article', changefreq: 'monthly', priority: 0.6 };

  const study = path.startsWith('/work/') ? CASE_STUDIES.find((x) => `/work/${x.id}` === path) : undefined;
  if (study) {
    const [title, description] = STUDY_META[study.id] ?? [`${study.name} Case Study | KorvenzaTech`, study.summary];
    const img = STUDY_IMAGES[study.id];
    return {
      ...base, path, title, description, name: study.name, ogType: 'article', changefreq: 'monthly', priority: 0.8,
      ...(img ? { image: `${SITE}${img}`, imageWidth: 1536, imageHeight: 1024 } : {}),
    };
  }

  return { ...base, path, title: 'Page not found | KorvenzaTech', description: 'The page you are looking for does not exist. Explore KorvenzaTech services, work and contact options.', name: 'Not found', noindex: true, changefreq: 'monthly', priority: 0 };
}

export const canonicalFor = (path: string) => `${SITE}${path === '/' ? '/' : path}`;

const ORG_ID = `${SITE}/#organization`;
const WEBSITE_ID = `${SITE}/#website`;

const organization = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'KorvenzaTech',
  url: `${SITE}/`,
  logo: `${SITE}/media/brand/logo-512.png`,
  image: OG_IMAGE,
  description: 'Software development company building custom software, SaaS platforms, mobile apps, AI solutions, websites, APIs and cloud-ready systems.',
  email: 'info@korvenzatech.com',
  founder: [
    { '@type': 'Person', name: 'Muhammad Rashid', jobTitle: 'Founder & CEO' },
    { '@type': 'Person', name: 'Muhammad Taha Amir', jobTitle: 'Co-Founder' },
  ],
  employee: [
    { '@type': 'Person', name: 'Suliman', jobTitle: 'Chief Operating Officer (COO)' },
  ],
  contactPoint: [
    { '@type': 'ContactPoint', contactType: 'customer service', email: 'info@korvenzatech.com', telephone: '+92-370-1691701', availableLanguage: ['English', 'Urdu', 'Pashto'] },
    { '@type': 'ContactPoint', contactType: 'sales', email: 'sales@korvenzatech.com', telephone: '+92-370-1691701', availableLanguage: ['English', 'Urdu', 'Pashto'] },
  ],
  knowsAbout: ['Custom Software Development', 'SaaS Development', 'Mobile App Development', 'Flutter', 'AI Solutions', 'Website Development', 'API Development', 'Cloud Solutions', 'UI/UX Design', 'Technical SEO'],
  areaServed: 'Worldwide',
};

function breadcrumbs(path: string, meta: RouteMeta) {
  const items: { name: string; url: string }[] = [{ name: 'Home', url: `${SITE}/` }];
  if (path.startsWith('/services/')) items.push({ name: 'Services', url: `${SITE}/services` });
  if (path.startsWith('/work/')) items.push({ name: 'Work', url: `${SITE}/work` });
  if (path.startsWith('/insights/')) items.push({ name: 'Insights', url: `${SITE}/insights` });
  if (path !== '/') items.push({ name: meta.name, url: canonicalFor(path) });
  return {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalFor(path)}#breadcrumb`,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

/** One JSON-LD @graph per page: Organization, WebSite, WebPage, BreadcrumbList (+ Service / FAQPage / CreativeWork). */
export function buildStructuredData(path: string) {
  const meta = getRouteMeta(path);
  const url = canonicalFor(path);
  const graph: Record<string, unknown>[] = [
    organization,
    { '@type': 'WebSite', '@id': WEBSITE_ID, url: `${SITE}/`, name: 'KorvenzaTech', inLanguage: 'en', publisher: { '@id': ORG_ID } },
  ];
  if (meta.noindex) return { '@context': 'https://schema.org', '@graph': graph };

  graph.push({
    '@type': path === '/about' ? 'AboutPage' : path === '/contact' ? 'ContactPage' : 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: meta.title,
    description: meta.description,
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    primaryImageOfPage: { '@type': 'ImageObject', url: meta.image },
    ...(path !== '/' ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
  });
  if (path !== '/') graph.push(breadcrumbs(path, meta));

  const service = SERVICES_DATA.find((s) => `/services/${s.id}` === path);
  if (service) {
    graph.push({ '@type': 'Service', '@id': `${url}#service`, name: service.title, serviceType: service.title, description: service.shortDesc, url, provider: { '@id': ORG_ID }, areaServed: 'Worldwide' });
    if (service.faqs.length) {
      graph.push({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: service.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
    }
  }

  if (path === '/about') {
    graph.push({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: FAQ_ITEMS.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) });
  }

  const article = ARTICLES.find((a) => `/insights/${a.slug}` === path);
  if (article) {
    graph.push({
      '@type': 'Article', '@id': `${url}#article`, headline: article.title, description: article.description, url,
      mainEntityOfPage: { '@id': `${url}#webpage` }, datePublished: article.published, dateModified: article.published,
      articleSection: article.category, inLanguage: 'en', image: meta.image,
      author: { '@type': 'Person', name: article.author.name, jobTitle: 'Founder & CEO', worksFor: { '@id': ORG_ID } },
      publisher: { '@id': ORG_ID },
    });
  }

  const study = CASE_STUDIES.find((s) => `/work/${s.id}` === path);
  if (study) {
    graph.push({ '@type': 'CreativeWork', '@id': `${url}#work`, name: study.name, headline: study.tagline, description: study.summary, url, creator: { '@id': ORG_ID }, about: study.industry, image: meta.image, keywords: study.coreTech.join(', ') });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
