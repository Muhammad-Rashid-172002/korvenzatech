import { useEffect } from 'react';
import { CASE_STUDIES, SERVICES_DATA } from '../data/companyData';

const SITE = 'https://korvenzatech.com';
const OG_IMAGE = `${SITE}/og-cover.png`;

type Meta = { title: string; description: string; keywords?: string };

const pages: Record<string, Meta> = {
  '/': {
    title: 'KorvenzaTech | Software Development, AI, SaaS, Mobile & Web',
    description: 'KorvenzaTech builds custom software, SaaS platforms, AI solutions, mobile apps, websites, APIs and cloud systems for startups and growing businesses worldwide.',
    keywords: 'KorvenzaTech, software development company, custom software development, SaaS development, AI development, mobile app development, web development, API development',
  },
  '/services': {
    title: 'Software Development Services | AI, SaaS, Apps, Web & APIs | KorvenzaTech',
    description: 'Explore KorvenzaTech services across AI solutions, SaaS, custom software, mobile apps, websites, APIs, cloud infrastructure, UI/UX and digital growth.',
  },
  '/work': {
    title: 'Software Case Studies & Solution Blueprints | KorvenzaTech',
    description: 'Explore selected KorvenzaTech products and enterprise solution blueprints across education technology, marketplaces, AI, SaaS, APIs, cloud and product design.',
  },
  '/industries': { title: 'Industry Software Solutions | KorvenzaTech', description: 'Custom software and digital product solutions for education, healthcare, finance, e-commerce, logistics, real estate, marketplaces and service businesses.' },
  '/about': { title: 'About KorvenzaTech | Software Engineering & Product Company', description: 'Learn about KorvenzaTech, our leadership, engineering philosophy, client-focused delivery model and approach to building modern digital products.' },
  '/insights': { title: 'Software, AI, SaaS & App Development Insights | KorvenzaTech', description: 'Practical guidance on AI, SaaS products, mobile apps, APIs, cloud systems, product architecture and digital growth.' },
  '/careers': { title: 'Technology Careers | KorvenzaTech', description: 'Explore engineering, product, design and growth opportunities with KorvenzaTech when roles are available.' },
  '/contact': { title: 'Contact KorvenzaTech | Software, AI & Product Enquiries', description: 'Contact KorvenzaTech for general enquiries, project and sales discussions, partnerships, WhatsApp follow-up and software development consultations.' },
  '/start-project': { title: 'Start a Software, AI, SaaS or App Project | KorvenzaTech', description: 'Share your product idea or business goal with KorvenzaTech and get a clear path for custom software, SaaS, AI, mobile, web, API or cloud development.' },
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
    const study = path.startsWith('/work/') ? CASE_STUDIES.find(s => `/work/${s.id}` === path) : undefined;

    const meta: Meta = service ? {
      title: `${service.title} Services | KorvenzaTech`,
      description: `${service.shortDesc} Explore business value, architecture, deliverables and use cases for KorvenzaTech ${service.title.toLowerCase()} services.`,
      keywords: `${service.title.toLowerCase()}, ${service.title.toLowerCase()} services, software development company, KorvenzaTech`,
    } : study ? {
      title: `${study.name} Case Study | KorvenzaTech`,
      description: `${study.tagline}. Review the challenge, engineering approach, platform capabilities, core technology and delivered outcomes.`,
    } : pages[path] || pages['/'];

    const canonicalUrl = `${SITE}${path === '/' ? '/' : path}`;
    document.title = meta.title;
    setMeta('description', meta.description);
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    if (meta.keywords) setMeta('keywords', meta.keywords);
    setMeta('author', 'KorvenzaTech');
    setMeta('theme-color', '#07110f');
    setMeta('og:type', study ? 'article' : 'website', true);
    setMeta('og:site_name', 'KorvenzaTech', true);
    setMeta('og:title', meta.title, true);
    setMeta('og:description', meta.description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:image', OG_IMAGE, true);
    setMeta('og:image:width', '1200', true);
    setMeta('og:image:height', '630', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', meta.title);
    setMeta('twitter:description', meta.description);
    setMeta('twitter:image', OG_IMAGE);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = canonicalUrl;

    document.querySelectorAll('[data-korvenza-schema="route"]').forEach(node => node.remove());

    const organization = {
      '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITE}/#organization`,
      name: 'KorvenzaTech', url: SITE, logo: `${SITE}/korvenza-logo.png`, image: OG_IMAGE,
      description: 'Software development company building custom software, SaaS platforms, mobile apps, AI solutions, websites, APIs and cloud-ready digital products.',
      founder: { '@type': 'Person', name: 'Muhammad Rashid', jobTitle: 'Founder & CEO' },
      contactPoint: [
        { '@type': 'ContactPoint', contactType: 'customer service', email: 'info@korvenzatech.com', telephone: '+92-370-1691701', availableLanguage: ['English', 'Urdu', 'Pashto'] },
        { '@type': 'ContactPoint', contactType: 'sales', email: 'sales@korvenzatech.com', telephone: '+92-370-1691701', availableLanguage: ['English', 'Urdu', 'Pashto'] },
      ],
      knowsAbout: ['Custom Software Development','SaaS Development','Mobile App Development','AI Solutions','Website Development','API Development','Cloud Solutions','UI/UX Design','Technical SEO'],
      areaServed: 'Worldwide',
    };

    const schemas: object[] = [
      organization,
      { '@context': 'https://schema.org', '@type': 'WebPage', name: meta.title, description: meta.description, url: canonicalUrl, isPartOf: { '@type': 'WebSite', '@id': `${SITE}/#website`, name: 'KorvenzaTech', url: SITE }, about: { '@id': `${SITE}/#organization` } },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: path === '/' ? [{ '@type':'ListItem', position:1, name:'KorvenzaTech', item:`${SITE}/` }] : path.split('/').filter(Boolean).map((segment, index, segments) => ({ '@type':'ListItem', position:index+1, name:segment.replaceAll('-',' ').replace(/\b\w/g, c=>c.toUpperCase()), item:`${SITE}/${segments.slice(0,index+1).join('/')}` })) },
    ];

    if (service) {
      schemas.push({ '@context': 'https://schema.org', '@type': 'Service', name: service.title, description: service.shortDesc, provider: { '@id': `${SITE}/#organization` }, areaServed: 'Worldwide', serviceType: service.title, url: canonicalUrl });
      if (service.faqs?.length) schemas.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: service.faqs.map(faq => ({ '@type': 'Question', name: faq.q, acceptedAnswer: { '@type': 'Answer', text: faq.a } })) });
    }

    if (study) {
      schemas.push({ '@context':'https://schema.org', '@type':'CreativeWork', name:study.name, headline:study.tagline, description:study.summary, url:canonicalUrl, creator:{ '@id':`${SITE}/#organization` }, about:study.industry, image:study.imageSrc });
    }

    schemas.forEach(value => { const schema = document.createElement('script'); schema.dataset.korvenzaSchema = 'route'; schema.type = 'application/ld+json'; schema.text = JSON.stringify(value); document.head.appendChild(schema); });
  }, [path]);
  return null;
}
