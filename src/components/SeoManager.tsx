import { useEffect } from 'react';
import { SERVICES_DATA } from '../data/companyData';

const SITE = 'https://korvenzatech.com';

type Meta = { title: string; description: string; keywords?: string };

const pages: Record<string, Meta> = {
  '/': {
    title: 'Software Development Company | AI, SaaS, Apps & Web | KorvenzaTech',
    description: 'KorvenzaTech is a software development company building custom software, SaaS platforms, mobile apps, AI solutions, websites, APIs and cloud-ready systems for startups and growing businesses.',
    keywords: 'software development company, custom software development company, SaaS development company, AI development company, mobile app development company, web development company, API development company, IT company',
  },
  '/services': {
    title: 'Software Development Services | SaaS, AI, Apps, Web & APIs | KorvenzaTech',
    description: 'Explore KorvenzaTech software development services including AI solutions, SaaS development, mobile apps, websites, custom software, APIs, cloud systems, UI/UX and digital growth.',
    keywords: 'software development services, IT services, SaaS development services, AI development services, app development services, web development services',
  },
  '/work': { title: 'Software & App Development Portfolio | KorvenzaTech', description: 'Explore KorvenzaTech work across AI-powered education, fitness and service marketplace products, with practical product and engineering details.', keywords: 'software development portfolio, mobile app portfolio, AI app development portfolio, SaaS portfolio' },
  '/industries': { title: 'Industry Software Solutions | KorvenzaTech', description: 'Custom software and digital product solutions for healthcare, education, fitness, finance, e-commerce, logistics, real estate, marketplaces and service businesses.', keywords: 'industry software solutions, healthcare software development, education software, fintech development, marketplace app development' },
  '/about': { title: 'About KorvenzaTech | Software Engineering Company', description: 'Learn how KorvenzaTech approaches software engineering, AI, product design and long-term technology partnerships for modern businesses.', keywords: 'KorvenzaTech, software engineering company, technology company, IT company' },
  '/insights': { title: 'Software, AI, SaaS & App Development Insights | KorvenzaTech', description: 'Practical guidance on software development, AI, SaaS products, mobile apps, APIs, cloud systems and digital product strategy.', keywords: 'software development insights, AI development guide, SaaS development guide, app development articles' },
  '/careers': { title: 'Technology Careers | KorvenzaTech', description: 'Explore engineering, product, design and growth opportunities with KorvenzaTech when roles are available.' },
  '/contact': { title: 'Contact KorvenzaTech | Software Development Project Enquiries', description: 'Contact KorvenzaTech to discuss custom software, SaaS, AI, mobile app, website, API, cloud or digital product development.' },
  '/start-project': { title: 'Start a Software Development Project | KorvenzaTech', description: 'Tell KorvenzaTech what you want to build, improve or automate. Discuss a software, SaaS, mobile app, AI, API or website project without needing technical knowledge.' },
};

function setMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let node = document.head.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement('meta');
    property ? node.setAttribute('property', name) : node.setAttribute('name', name);
    document.head.appendChild(node);
  }
  node.content = content;
}

export function SeoManager({ path }: { path: string }) {
  useEffect(() => {
    const service = path.startsWith('/services/') ? SERVICES_DATA.find(s => `/services/${s.id}` === path) : undefined;
    const meta = service ? {
      title: `${service.title} Company & Services | KorvenzaTech`,
      description: `${service.shortDesc} KorvenzaTech helps startups and businesses plan, design, build and launch reliable ${service.title.toLowerCase()} solutions.`,
      keywords: `${service.title.toLowerCase()}, ${service.title.toLowerCase()} company, ${service.title.toLowerCase()} services, software development company, KorvenzaTech`,
    } : pages[path] || pages['/'];

    const canonicalUrl = `${SITE}${path === '/' ? '/' : path}`;
    document.title = meta.title;
    setMeta('description', meta.description);
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    if (meta.keywords) setMeta('keywords', meta.keywords);
    setMeta('author', 'KorvenzaTech');
    setMeta('theme-color', '#08110f');
    setMeta('og:type', 'website', true);
    setMeta('og:site_name', 'KorvenzaTech', true);
    setMeta('og:title', meta.title, true);
    setMeta('og:description', meta.description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:image', `${SITE}/korvenza-logo.png`, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', meta.title);
    setMeta('twitter:description', meta.description);
    setMeta('twitter:image', `${SITE}/korvenza-logo.png`);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    document.querySelectorAll('[data-korvenza-schema="route"]').forEach(node => node.remove());

    const schemas: object[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE}/#organization`,
        name: 'KorvenzaTech',
        url: SITE,
        logo: `${SITE}/korvenza-logo.png`,
        description: 'Software development company building custom software, SaaS platforms, mobile apps, AI solutions, websites, APIs and cloud-ready digital products.',
        founder: { '@type': 'Person', name: 'Muhammad Rashid', jobTitle: 'Founder & CEO' },
        knowsAbout: ['Custom Software Development','SaaS Development','Mobile App Development','AI Solutions','Website Development','API Development','Cloud Solutions','UI/UX Design','Digital Marketing'],
        areaServed: 'Worldwide',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: meta.title,
        description: meta.description,
        url: canonicalUrl,
        isPartOf: { '@type': 'WebSite', '@id': `${SITE}/#website`, name: 'KorvenzaTech', url: SITE },
        about: { '@id': `${SITE}/#organization` },
      },
    ];

    if (service) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        description: service.shortDesc,
        provider: { '@id': `${SITE}/#organization` },
        areaServed: 'Worldwide',
        serviceType: service.title,
        url: canonicalUrl,
      });
      if (service.faqs?.length) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: service.faqs.map(faq => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        });
      }
    }

    schemas.forEach(value => {
      const schema = document.createElement('script');
      schema.dataset.korvenzaSchema = 'route';
      schema.type = 'application/ld+json';
      schema.text = JSON.stringify(value);
      document.head.appendChild(schema);
    });
  }, [path]);
  return null;
}
