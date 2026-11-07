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

const STUDY_APP_CATEGORY: Record<string, string> = { 'fitmind-ai': 'HealthApplication', 'ielts-ai-master': 'EducationalApplication' };

const STATIC: Record<string, { title: string; description: string; name: string; keywords?: string; changefreq: 'weekly' | 'monthly'; priority: number }> = {
  '/': {
    title: 'Software Development Company | Mobile Apps & AI Solutions — KorvenzaTech',
    description: 'KorvenzaTech builds custom Android and iOS apps, practical AI solutions and automation, and scalable software for startups and businesses worldwide.',
    name: 'Home',
    changefreq: 'weekly', priority: 1.0,
  },
  '/services': { title: 'Mobile App, AI & Software Development Services | KorvenzaTech', description: 'Custom mobile app development and AI solutions & automation, plus custom software, SaaS, websites, APIs, cloud, UI/UX design and technical growth.', name: 'Services', changefreq: 'weekly', priority: 0.9 },
  '/work': { title: 'Software Development Portfolio | KorvenzaTech', description: 'Case studies of FitMind AI, IELTS AI Master, SkillNova and CareDesk — AI mobile apps, a service marketplace and a hospital complaint management system.', name: 'Work', changefreq: 'weekly', priority: 0.8 },
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
    const { title, description } = service.seo;
    return { ...base, path, title, description, name: service.title, changefreq: 'monthly', priority: 0.9 };
  }

  const article = path.startsWith('/insights/') ? ARTICLES.find((a) => `/insights/${a.slug}` === path) : undefined;
  if (article) return { ...base, path, title: `${article.title} | KorvenzaTech`, description: article.description, name: article.title, ogType: 'article', changefreq: 'monthly', priority: 0.6 };

  const study = path.startsWith('/work/') ? CASE_STUDIES.find((x) => `/work/${x.id}` === path) : undefined;
  if (study) {
    const title = `${study.name}: ${study.category} | KorvenzaTech`;
    const description = `${study.summary} ${study.coreTech.slice(0, 3).join(', ')}.`.slice(0, 300);
    const img = study.imageSrc.startsWith('/media/') ? study.imageSrc : '/media/work/ielts-ai-master-1536.webp';
    return { ...base, path, title, description, name: study.name, ogType: 'article', changefreq: 'monthly', priority: 0.8, image: `${SITE}${img}`, imageWidth: 1536, imageHeight: 1024 };
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
  description: 'Software development company building custom mobile apps, AI solutions and automation, and scalable digital products.',
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
  knowsAbout: ['Mobile App Development', 'Flutter', 'AI Solutions', 'Business Process Automation', 'Custom Software Development', 'SaaS Development', 'Website Development', 'API Development', 'Cloud Solutions', 'UI/UX Design', 'Technical SEO'],
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
    graph.push({ '@type': 'Service', '@id': `${url}#service`, name: service.title, serviceType: service.title, description: service.description, url, provider: { '@id': ORG_ID }, areaServed: 'Worldwide',
      hasOfferCatalog: { '@type': 'OfferCatalog', name: `${service.title} capabilities`, itemListElement: (service.capabilities?.map((c) => c.name) ?? service.features).map((n) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n } })) } });
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
    graph.push({ '@type': 'CreativeWork', '@id': `${url}#work`, name: `${study.name} case study`, headline: study.headline, description: study.summary, url, creator: { '@id': ORG_ID }, about: study.industry, image: meta.image, keywords: study.coreTech.join(', ') });
    // Live store apps only: SoftwareApplication without ratings, prices or download counts.
    const store = study.links.find((l) => l.href.startsWith('https://play.google.com/'));
    if (store) graph.push({ '@type': 'SoftwareApplication', '@id': `${url}#app`, name: study.name, description: study.summary, operatingSystem: 'Android', applicationCategory: STUDY_APP_CATEGORY[study.id] ?? 'MobileApplication', url: store.href, installUrl: store.href, author: { '@id': ORG_ID }, publisher: { '@id': ORG_ID } });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
