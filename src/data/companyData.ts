import { IndustryItem, TechStackCategory, ProcessStep, FAQItem, OpenRole } from '../types';

export { SERVICES_DATA, PRIMARY_SERVICES, SUPPORTING_SERVICES, SERVICE_OPTIONS } from './services';
export { CASE_STUDIES, WORK_REDIRECTS } from './caseStudies';

export const INDUSTRIES_DATA: IndustryItem[] = [
  {
    id: 'healthcare',
    name: 'Healthcare & Biotech',
    iconName: 'Activity',
    tagline: 'Privacy-conscious digital tools for healthcare workflows and sensitive data.',
    problemSolved: 'Reducing paper bottlenecks and fragmented workflows while designing around strong privacy, access-control and data-protection requirements.',
    exampleSolutions: ['Telemedicine Portals', 'Clinical Workflow Tools', 'Secure Patient Messaging', 'Medical Asset Tracking']
  },
  {
    id: 'education',
    name: 'Education & EdTech',
    iconName: 'GraduationCap',
    tagline: 'Interactive learning platforms and AI-powered student evaluation.',
    problemSolved: 'Engaging modern learners and automating complex exam grading for international academic programs.',
    exampleSolutions: ['AI Learning Assessment', 'Virtual Classroom Hubs', 'Student Portals', 'Automated Grading Engines']
  },
  {
    id: 'fitness',
    name: 'Fitness & Wellness',
    iconName: 'Dumbbell',
    tagline: 'Smart mobile health trackers and personalized coaching technology.',
    problemSolved: 'Driving long-term user retention with real-time biometric feedback and effortless meal logging.',
    exampleSolutions: ['AI Meal Vision Apps', 'Workout Generators', 'Wearable Sync Platforms', 'Subscription Member Apps']
  },
  {
    id: 'finance',
    name: 'FinTech & Banking',
    iconName: 'DollarSign',
    tagline: 'High-security transaction systems, payment gateways, and financial dashboards.',
    problemSolved: 'Designing reliable financial workflows with strong attention to transaction integrity, access control, auditability and performance.',
    exampleSolutions: ['Secure Wallet Infrastructure', 'Custom Payment Gateways', 'Financial Analytics Dashboards', 'Fraud Detection Models']
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce & Retail',
    iconName: 'ShoppingBag',
    tagline: 'Scalable online stores, custom marketplaces, and inventory engines.',
    problemSolved: 'Connecting physical store stock with web and mobile platforms to deliver instant omnichannel checkout.',
    exampleSolutions: ['Multi-Vendor Marketplaces', 'Real-Time Inventory Sync', 'Custom Checkout Gateways', 'AI Product Recommenders']
  },
  {
    id: 'realestate',
    name: 'Real Estate & PropTech',
    iconName: 'Building',
    tagline: 'Property management systems, virtual tours, and tenant portals.',
    problemSolved: 'Streamlining multi-property leasing, automated rent collection, and maintenance ticket dispatching.',
    exampleSolutions: ['Property Management Portals', 'Interactive Listing Search', 'Digital Lease Signatures', 'Tenant Communication Hubs']
  },
  {
    id: 'logistics',
    name: 'Logistics & Supply Chain',
    iconName: 'Truck',
    tagline: 'Fleet tracking, route optimization, and warehouse management software.',
    problemSolved: 'Providing full operational visibility over fleet routes, fuel consumption, and warehouse inventory dispatches.',
    exampleSolutions: ['GPS Fleet Tracking Systems', 'Route Optimization Engines', 'Warehouse Barcode Scanners', 'Dispatch Consoles']
  },
  {
    id: 'services',
    name: 'Professional Services',
    iconName: 'Briefcase',
    tagline: 'Client management portals, document automation, and scheduling hubs.',
    problemSolved: 'Replacing manual email ping-pong with organized client portals and automated appointment booking.',
    exampleSolutions: ['Client Document Portals', 'Automated Scheduling Systems', 'Custom Billing Engines', 'Project Workspaces']
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Discovery',
    description: 'We listen to your goals, analyze your operational challenges, and understand your target audience without confusing technical jargon.',
    deliverable: 'Clear Product Roadmap & Scope Document'
  },
  {
    number: '02',
    title: 'Planning',
    description: 'We select the optimal technology stack, define secure system flows, and structure a budget-conscious development timeline.',
    deliverable: 'Technical System Blueprint & Wireframe Flow'
  },
  {
    number: '03',
    title: 'Design',
    description: 'Our design team crafts intuitive, highly interactive screen prototypes so you can preview and refine the user experience before code is written.',
    deliverable: 'Interactive Clickable Figma Prototype'
  },
  {
    number: '04',
    title: 'Development',
    description: 'Our senior engineers build your product in transparent 2-week sprints with clean code, modular architecture, and bi-weekly live demos.',
    deliverable: 'Working Application Builds (Staging Link)'
  },
  {
    number: '05',
    title: 'Testing',
    description: 'We rigorously test load performance, mobile responsiveness, edge case handling, and cybersecurity protection before launch.',
    deliverable: 'QA & Security Test Report'
  },
  {
    number: '06',
    title: 'Launch',
    description: 'We handle app store submissions, cloud server provisioning, domain SSL setup, and seamless database migrations.',
    deliverable: 'Live Production Platform & App Store Links'
  },
  {
    number: '07',
    title: 'Support',
    description: 'We monitor uptime, patch software, update third-party APIs, and continuously help you scale features as your business grows.',
    deliverable: 'Maintenance Plan & Ongoing Optimization'
  }
];

/**
 * Items marked `unconfirmed` are hidden on the site until Rashid confirms the team has
 * shipped production work with them (MASTER_PLAN → TODO). Not deleted, just hidden.
 */
export const TECH_STACK: TechStackCategory[] = [
  {
    category: 'Mobile Applications',
    description: 'Cross-platform and native engineering for smartphones.',
    items: [
      { name: 'Flutter', description: 'Unified iOS and Android codebase with high 60fps performance' },
      { name: 'Android Native (Kotlin)', description: 'Deep hardware and system integration for Android', unconfirmed: true },
      { name: 'iOS Native (Swift)', description: 'High-performance Apple ecosystem engineering', unconfirmed: true },
      { name: 'React Native', description: 'Cross-platform mobile apps powered by React', unconfirmed: true }
    ]
  },
  {
    category: 'Frontend & Web',
    description: 'Blazing-fast modern web applications and user interfaces.',
    items: [
      { name: 'React', description: 'Interactive single-page web app interfaces' },
      { name: 'Next.js', description: 'Server-side rendered web applications optimized for speed & SEO' },
      { name: 'TypeScript', description: 'Type-safe JavaScript for reliable enterprise codebases' },
      { name: 'Tailwind CSS', description: 'Utility-first styling for custom responsive UI design' }
    ]
  },
  {
    category: 'Backend & APIs',
    description: 'Scalable server architecture and secure data controllers.',
    items: [
      { name: 'Node.js / Express', description: 'High-throughput event-driven microservices' },
      { name: 'Python (FastAPI)', description: 'Optimal engine for AI models and data analytics' },
      { name: 'Firebase Backend', description: 'Real-time database, authentication, and cloud functions' },
      { name: 'REST APIs', description: 'Structured, versioned communication layers for client applications' },
      { name: 'GraphQL', description: 'Flexible query APIs for complex client data needs', unconfirmed: true }
    ]
  },
  {
    category: 'AI & Intelligence',
    description: 'Generative AI models and smart automation algorithms.',
    items: [
      { name: 'Multimodal AI API', description: 'Multimodal intelligence for text, vision, and reasoning' },
      { name: 'Language AI', description: 'Advanced natural language processing and agent execution' },
      { name: 'RAG Infrastructure', description: 'Private vector search over company documents' },
      { name: 'Computer Vision', description: 'Image recognition and automated inspection models', unconfirmed: true }
    ]
  },
  {
    category: 'Cloud & Infrastructure',
    description: 'Global hosting environments built for high availability.',
    items: [
      { name: 'Google Cloud Platform', description: 'Cloud hosting, Cloud Run and Firebase services' },
      { name: 'Amazon Web Services (AWS)', description: 'Scalable cloud infrastructure and S3 storage' },
      { name: 'Docker & Containers', description: 'Consistent application environments across cloud servers' },
      { name: 'CI/CD Pipelines', description: 'Automated testing and zero-downtime deployment' }
    ]
  }
];


export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What does KorvenzaTech do?',
    answer: 'KorvenzaTech is a founder-led software and AI product studio based in Pakistan, working with clients internationally. We design, build, automate, and scale digital products. We develop AI systems, mobile applications, custom web platforms, APIs, cloud infrastructure, and technical growth strategies for businesses of all sizes.'
  },
  {
    question: 'Can you help if I only have an idea and no technical background?',
    answer: 'Yes. You can bring the idea or operational challenge in plain English, and we guide you through strategy, user experience design, and software engineering without unnecessary technical jargon.'
  },
  {
    question: 'Do I need technical knowledge to work with KorvenzaTech?',
    answer: 'Not at all. We explain every decision in terms of business value (cost savings, speed, security, user convenience). We handle all technical complexity, server management, app store publishing, and code quality behind the scenes.'
  },
  {
    question: 'How much does custom software or mobile app development cost?',
    answer: 'Project cost depends on scope, platforms, integrations, security requirements, design depth, and delivery timeline. We review the requirements first and provide a clear project estimate before development begins.'
  },
  {
    question: 'How long does it take to build a digital product?',
    answer: 'Timelines depend on product scope, integrations, design complexity, testing requirements, and feedback cycles. After discovery, we provide a realistic delivery plan with clear milestones and review points.'
  },
  {
    question: 'Can KorvenzaTech build custom AI applications?',
    answer: 'Yes. We build practical intelligent software such as customer-support assistants, document analysis workflows, image-understanding features, recommendation systems, and custom business automation.'
  },
  {
    question: 'Do you develop for both Android and iOS smartphones?',
    answer: 'Yes. We use cross-platform frameworks like Flutter alongside native iOS/Android development to ensure your mobile app works smoothly on all Apple and Android devices with a single clean codebase.'
  },
  {
    question: 'Can you improve or expand an existing application?',
    answer: 'Yes. Our engineering team can conduct a code audit on your existing software, fix bugs, optimize slow cloud databases, modernize outdated design, or add new AI and mobile app capabilities.'
  },
  {
    question: 'Do you provide maintenance and support after launch?',
    answer: 'Post-launch maintenance and support can be included based on the project agreement, covering areas such as bug fixes, security updates, performance improvements, integration maintenance, and planned feature releases.'
  },
  {
    question: 'Do you work with international clients?',
    answer: 'Yes. KorvenzaTech works remotely with clients and collaborators across different regions and supports international delivery with flexible communication schedules.'
  },
  {
    question: 'Can KorvenzaTech sign an NDA (Non-Disclosure Agreement)?',
    answer: 'Absolutely. We respect intellectual property and are happy to sign a mutual NDA before you share sensitive project details or proprietary business ideas.'
  },
  {
    question: 'How do I start a project with KorvenzaTech?',
    answer: 'Simply click "Start a project" or fill out our project inquiry form. Share a brief description of what you want to build, and our team will review it and respond with the most practical next step.'
  }
];

export const OPEN_ROLES: OpenRole[] = [
  {
    id: 'sr-flutter-engineer',
    title: 'Senior Flutter Mobile Engineer',
    department: 'Engineering',
    location: 'Remote / Global',
    type: 'Full-time',
    description: 'Lead the architecture and mobile execution of high-performance cross-platform applications for global clients.',
    requirements: ['4+ years of Flutter / Dart experience', 'Experience with state management (Riverpod/Bloc)', 'Published apps on App Store & Google Play', 'Strong API integration skills']
  },
  {
    id: 'ai-systems-engineer',
    title: 'AI Systems & RAG Engineer',
    department: 'AI Lab',
    location: 'Remote / Global',
    type: 'Full-time',
    description: 'Design custom AI pipelines, vector database systems, and agentic workflows using modern language-model and agent frameworks.',
    requirements: ['Solid Python / Node.js background', 'Experience with language-model APIs / LangChain / LlamaIndex', 'Understanding of vector search & embeddings', 'Focus on latency optimization']
  },
  {
    id: 'fullstack-nextjs-dev',
    title: 'Full-Stack Next.js Developer',
    department: 'Engineering',
    location: 'Remote / Global',
    type: 'Full-time',
    description: 'Build enterprise web platforms, SaaS dashboards, and server-rendered applications using Next.js and TypeScript.',
    requirements: ['3+ years with Next.js, React & TypeScript', 'Tailwind CSS mastery', 'REST / GraphQL API design', 'Database experience (Firestore/PostgreSQL)']
  }
];

/** Tech list as shown on the site (confirmed items only). */
export const TECH_STACK_VISIBLE: TechStackCategory[] = TECH_STACK.map((c) => ({ ...c, items: c.items.filter((i) => !i.unconfirmed) }));
