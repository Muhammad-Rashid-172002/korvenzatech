import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const baseFile = path.join(dist, 'index.html');
if (!fs.existsSync(baseFile)) process.exit(0);
const base = fs.readFileSync(baseFile, 'utf8');
const site = 'https://korvenzatech.com';

const services = {
  'ai-solutions': ['AI Development Company & Intelligent Software Solutions | KorvenzaTech', 'AI assistants, business automation, intelligent software and data-driven digital experiences designed around real business workflows.'],
  'api-development': ['Custom API Development Company | KorvenzaTech', 'Secure custom APIs, backend integrations, webhooks and connected software systems for mobile apps, websites and business platforms.'],
  'mobile-app-development': ['Mobile App Development Company | Flutter, iOS & Android | KorvenzaTech', 'Professional mobile app development for Android and iOS, including Flutter apps, cloud backends, notifications, maps, payments and scalable product engineering.'],
  'web-development': ['Website & Web App Development Company | KorvenzaTech', 'Modern corporate websites, SaaS websites, web applications and conversion-focused digital experiences with responsive engineering and technical SEO.'],
  'custom-software': ['Custom Software Development Company | KorvenzaTech', 'Custom business software, internal platforms, dashboards, workflow systems, CRM/ERP solutions and operational tools built around your process.'],
  'saas-development': ['SaaS Development Company | Custom SaaS Product Engineering | KorvenzaTech', 'End-to-end SaaS development for MVPs and scalable software products, including subscriptions, user workspaces, dashboards, APIs, cloud backends and admin systems.'],
  'cloud-solutions': ['Cloud & Backend Development Services | KorvenzaTech', 'Cloud-ready backends, databases, authentication, storage, serverless systems, deployment and scalable infrastructure for modern digital products.'],
  'ui-ux-design': ['UI/UX Design for Apps, SaaS & Websites | KorvenzaTech', 'Product-focused UI/UX design for mobile apps, SaaS platforms, websites and dashboards with clear user flows and modern design systems.'],
  'digital-marketing': ['Digital Marketing & Technology Growth Services | KorvenzaTech', 'SEO, content strategy, conversion optimization and digital growth services aligned with modern websites, software products and technology businesses.'],
};

const pages = {
  '/': ['Software Development Company | AI, SaaS, Apps & Web | KorvenzaTech', 'KorvenzaTech is a software development company building custom software, SaaS platforms, mobile apps, AI solutions, websites, APIs and cloud-ready systems for startups and growing businesses.'],
  '/services': ['Software Development Services | KorvenzaTech', 'AI, SaaS, mobile app, website, API, cloud, UI/UX and custom software development services from KorvenzaTech.'],
  '/work': ['Software & App Development Portfolio | KorvenzaTech', 'Explore KorvenzaTech work across AI-powered education, fitness and service marketplace products.'],
  '/industries': ['Industry Software Solutions | KorvenzaTech', 'Software and digital product solutions for healthcare, education, fitness, finance, e-commerce, logistics, real estate and service businesses.'],
  '/about': ['About KorvenzaTech | Software Engineering & Digital Product Company', 'Learn about KorvenzaTech, its engineering philosophy, company values and Founder & CEO Muhammad Rashid.'],
  '/insights': ['Software, AI & SaaS Insights | KorvenzaTech', 'Practical articles and guidance on AI, SaaS, apps, APIs, software architecture and digital products.'],
  '/careers': ['Technology Careers | KorvenzaTech', 'Explore engineering, product, design and growth opportunities at KorvenzaTech when roles are available.'],
  '/contact': ['Contact KorvenzaTech | Software & AI Project Enquiries', 'Contact KorvenzaTech to discuss AI, SaaS, mobile app, website, API or custom software development.'],
  '/start-project': ['Start a Software Project | KorvenzaTech', 'Share your software, app, SaaS, AI or website idea with KorvenzaTech. Technical knowledge is not required.'],
};
Object.entries(services).forEach(([id, meta]) => pages[`/services/${id}`] = meta);

function esc(s='') { return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }
function build(route, [title, description]) {
  const canonical = `${site}${route === '/' ? '/' : route}`;
  let html = base;
  html = html.replace(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`);
  const breadcrumb = route === '/' ? [] : route.split('/').filter(Boolean);
  const schema = route.startsWith('/services/') ? {
    '@context':'https://schema.org','@type':'Service','name':title.split('|')[0].trim(),'description':description,'url':canonical,
    'provider':{'@type':'Organization','@id':site+'/#organization','name':'KorvenzaTech','url':site},'areaServed':'Worldwide'
  } : {
    '@context':'https://schema.org','@type':'WebPage','name':title,'description':description,'url':canonical,
    'isPartOf':{'@type':'WebSite','name':'KorvenzaTech','url':site}
  };

  const orgSchema = {
    '@context':'https://schema.org','@type':'Organization','@id':site+'/#organization',name:'KorvenzaTech',url:site,
    logo:site+'/korvenza-logo.png',description:'Software development company building custom software, SaaS platforms, mobile apps, AI solutions, websites, APIs and cloud-ready systems.',
    founder:{'@type':'Person',name:'Muhammad Rashid',jobTitle:'Founder & CEO'},areaServed:'Worldwide',
    knowsAbout:['Custom Software Development','SaaS Development','Mobile App Development','AI Solutions','Website Development','API Development','Cloud Solutions','UI/UX Design']
  };
  if (breadcrumb.length) schema.breadcrumb = {'@type':'BreadcrumbList','itemListElement':breadcrumb.map((name,i)=>({'@type':'ListItem','position':i+1,'name':name.replaceAll('-',' '),'item':site+'/'+breadcrumb.slice(0,i+1).join('/')}))};
  html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(orgSchema)}</script><script type="application/ld+json">${JSON.stringify(schema)}</script></head>`);
  html = html.replace(/<div id="root">[\s\S]*?<\/div>\s*<script type="module"/, `<div id="root"><main style="max-width:1100px;margin:0 auto;padding:72px 24px;font-family:system-ui;background:#08090B;color:#f7f7f8"><p style="color:#a78bfa;font-weight:700">KorvenzaTech</p><h1>${esc(title.split('|')[0].trim())}</h1><p>${esc(description)}</p><p><a href="/services">Services</a> · <a href="/work">Work</a> · <a href="/about">About</a> · <a href="/contact">Contact</a></p></main></div><script type="module"`);
  return html;
}
for (const [route, meta] of Object.entries(pages)) {
  if (route === '/') { fs.writeFileSync(baseFile, build(route, meta)); continue; }
  const dir = path.join(dist, ...route.split('/').filter(Boolean)); fs.mkdirSync(dir, {recursive:true}); fs.writeFileSync(path.join(dir,'index.html'), build(route, meta));
}
