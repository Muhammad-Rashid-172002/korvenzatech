import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const baseFile = path.join(dist, 'index.html');
if (!fs.existsSync(baseFile)) process.exit(0);
const base = fs.readFileSync(baseFile, 'utf8');
const site = 'https://korvenzatech.com';
const og = `${site}/og-cover.png`;

const services = {
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

const pages = {
  '/': ['KorvenzaTech | Software Development, AI, SaaS, Mobile & Web', 'KorvenzaTech builds custom software, SaaS platforms, AI solutions, mobile apps, websites, APIs and cloud systems for startups and growing businesses worldwide.'],
  '/services': ['Software Development Services | AI, SaaS, Apps, Web & APIs | KorvenzaTech', 'Explore KorvenzaTech services across AI solutions, SaaS, custom software, mobile apps, websites, APIs, cloud infrastructure, UI/UX and digital growth.'],
  '/work': ['Software Case Studies & Solution Blueprints | KorvenzaTech', 'Explore selected KorvenzaTech products and enterprise solution blueprints across education technology, marketplaces, AI, SaaS, APIs, cloud and product design.'],
  '/work/ielts-ai-master': ['IELTS AI Master Case Study | KorvenzaTech', 'AI-powered education product case study covering speaking, writing, reading and listening workflows, Firebase architecture and mobile product delivery.'],
  '/work/skilllink': ['SkillLink Marketplace Case Study | KorvenzaTech', 'On-demand services marketplace case study covering customer and worker flows, real-time job lifecycle, Firebase architecture and Google Maps integration.'],
  '/industries': ['Industry Software Solutions | KorvenzaTech', 'Software and digital product solutions for healthcare, education, finance, e-commerce, logistics, real estate, marketplaces and professional services.'],
  '/about': ['About KorvenzaTech | Software Engineering & Product Company', 'Learn about KorvenzaTech, our leadership, engineering philosophy, client-focused delivery model and approach to building modern digital products.'],
  '/insights': ['Software, AI, SaaS & App Development Insights | KorvenzaTech', 'Practical guidance on AI, SaaS products, mobile apps, APIs, cloud systems, product architecture and digital growth.'],
  '/careers': ['Technology Careers | KorvenzaTech', 'Explore engineering, product, design and growth opportunities at KorvenzaTech when roles are available.'],
  '/contact': ['Contact KorvenzaTech | Software, AI & Product Enquiries', 'Contact KorvenzaTech for general enquiries, project and sales discussions, partnerships, WhatsApp follow-up and software development consultations.'],
  '/start-project': ['Start a Software, AI, SaaS or App Project | KorvenzaTech', 'Share your product idea or business goal with KorvenzaTech and get a clear path for custom software, SaaS, AI, mobile, web, API or cloud development.'],
};
Object.entries(services).forEach(([id, meta]) => pages[`/services/${id}`] = meta);

function esc(s='') { return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }
function build(route, [title, description]) {
  const canonical = `${site}${route === '/' ? '/' : route}`;
  let html = base;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?\s*>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?\s*>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?\s*>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?\s*>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?\s*>/, `<meta property="og:image" content="${og}" />`)
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?\s*>/, `<meta name="twitter:title" content="${esc(title)}" />`)
    .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?\s*>/, `<meta name="twitter:description" content="${esc(description)}" />`);

  const segments = route.split('/').filter(Boolean);
  const breadcrumb = segments.length ? { '@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':segments.map((name,i)=>({'@type':'ListItem','position':i+1,'name':name.replaceAll('-',' '),'item':site+'/'+segments.slice(0,i+1).join('/')})) } : null;
  const routeSchema = route.startsWith('/services/') ? {
    '@context':'https://schema.org','@type':'Service','name':title.split('|')[0].trim(),'description':description,'url':canonical,
    'provider':{'@type':'Organization','@id':site+'/#organization','name':'KorvenzaTech','url':site},'areaServed':'Worldwide'
  } : {
    '@context':'https://schema.org','@type': route.startsWith('/work/') ? 'CreativeWork' : 'WebPage','name':title,'description':description,'url':canonical,
    'isPartOf':{'@type':'WebSite','name':'KorvenzaTech','url':site}
  };
  const orgSchema = {
    '@context':'https://schema.org','@type':'Organization','@id':site+'/#organization',name:'KorvenzaTech',url:site,
    logo:site+'/korvenza-logo.png',image:og,description:'Software development company building custom software, SaaS platforms, mobile apps, AI solutions, websites, APIs and cloud-ready systems.',
    founder:{'@type':'Person',name:'Muhammad Rashid',jobTitle:'Founder & CEO'},areaServed:'Worldwide',
    contactPoint:[{'@type':'ContactPoint',contactType:'customer service',email:'info@korvenzatech.com',telephone:'+92-370-1691701'},{'@type':'ContactPoint',contactType:'sales',email:'sales@korvenzatech.com',telephone:'+92-370-1691701'}]
  };
  html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(orgSchema)}</script><script type="application/ld+json">${JSON.stringify(routeSchema)}</script>${breadcrumb ? `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>` : ''}</head>`);

  // Keep the React root visually clean. Previous builds injected a visible SEO shell here,
  // which caused a one-second flash before hydration. Semantic fallback is now noscript-only.
  const fallback = `<noscript><main style="max-width:980px;margin:0 auto;padding:72px 24px;font-family:system-ui;color:#0f172a"><h1>${esc(title.split('|')[0].trim())}</h1><p>${esc(description)}</p><p><a href="/services">Services</a> · <a href="/work">Work</a> · <a href="/about">About</a> · <a href="/contact">Contact</a></p></main></noscript>`;
  html = html.replace('<div id="root"></div>', `<div id="root"></div>${fallback}`);
  return html;
}

for (const [route, meta] of Object.entries(pages)) {
  if (route === '/') { fs.writeFileSync(baseFile, build(route, meta)); continue; }
  const dir = path.join(dist, ...route.split('/').filter(Boolean));
  fs.mkdirSync(dir, {recursive:true});
  fs.writeFileSync(path.join(dir,'index.html'), build(route, meta));
}
