import { ServiceItem, CaseStudy, IndustryItem, TechStackCategory, ProcessStep, InsightArticle, FAQItem, OpenRole } from '../types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'ai-solutions',
    title: 'AI Solutions',
    category: 'AI & Automation',
    iconName: 'Bot',
    shortDesc: 'Intelligent systems that automate work, analyze data, and power smart digital experiences.',
    businessValue: 'Eliminate repetitive manual tasks, provide 24/7 intelligent customer responses, and make data-driven decisions faster.',
    technicalDescription: 'Custom AI agent architectures, RAG systems, model fine-tuning, natural language processing, and multimodal vision integrations.',
    whoNeedsIt: 'Businesses looking to automate client inquiries, streamline document processing, or build smart AI features directly into their products.',
    features: [
      'AI Assistants & Intelligent Chatbot Systems',
      'Business Workflow & Task Automation',
      'Document Analysis & Extraction Engines',
      'Personalized Recommendation Systems',
      'Custom language-model integrations',
      'Computer Vision & Image Understanding',
      'Natural Language Analytics & Summarization'
    ],
    deliverables: [
      'Fine-tuned AI Model Pipeline',
      'Secure Middleware & API Layer',
      'Admin Dashboard for Performance Monitoring',
      'Full Security & Privacy Compliance Setup'
    ],
    useCases: [
      'Customer support auto-resolution up to 80%',
      'Automated invoice & document reading',
      'Personalized learning/fitness feedback engines'
    ],
    faqs: [
      {
        q: 'Do I need my own training data to build an AI solution?',
        a: 'Not necessarily. We can leverage modern pretrained language models, augmenting them with your business documents or knowledge base using Retrieval-Augmented Generation (RAG).'
      },
      {
        q: 'How do you ensure user privacy with AI models?',
        a: 'We implement zero-data-retention enterprise API configurations and keep all proprietary data isolated inside private encrypted databases.'
      }
    ]
  },
  {
    id: 'api-development',
    title: 'Custom API Development',
    category: 'Software',
    iconName: 'Network',
    shortDesc: 'Secure connections that allow your apps, websites, payment systems, and business tools to talk to each other.',
    businessValue: 'Unify separate software tools into one seamless workflow so data updates everywhere instantly without manual copy-pasting.',
    technicalDescription: 'High-throughput RESTful and GraphQL APIs, webhooks, rate-limited gateway architectures, and OAuth2 authentication handlers.',
    whoNeedsIt: 'Companies connecting legacy systems to new mobile apps, integrating third-party payment gateways, or sharing data with partner platforms.',
    features: [
      'High-Performance REST & Backend APIs',
      'Third-Party Service & SaaS Integrations',
      'Payment Gateway Integration (Stripe, PayPal, Local Gateways)',
      'Secure OAuth2 & JWT Authentication Systems',
      'Real-Time Webhooks & Streaming Data APIs',
      'AI Endpoint Proxying & Caching Layers'
    ],
    deliverables: [
      'Production-Ready API Codebase',
      'Interactive OpenAPI / Swagger Documentation',
      'Automated Rate-Limiting & Security Shield',
      'CI/CD Deployment Pipelines'
    ],
    useCases: [
      'Syncing inventory between physical ERPs and web stores',
      'Processing real-time payment notifications across mobile apps',
      'Connecting custom mobile apps to central business databases'
    ],
    faqs: [
      {
        q: 'What is an API in simple terms?',
        a: 'An API (Application Programming Interface) acts as a secure digital messenger that transfers information between different apps or websites so they can work together automatically.'
      }
    ]
  },
  {
    id: 'mobile-app-development',
    title: 'Mobile App Development',
    category: 'Applications',
    iconName: 'Smartphone',
    shortDesc: 'Fast, beautiful, and scalable mobile applications for Android and iOS.',
    businessValue: 'Engage your customers directly on their smartphones with push notifications, offline capability, and smooth user experiences.',
    technicalDescription: 'Cross-platform Flutter & native iOS/Android development with state-managed architectures, background sync, and biometrics.',
    whoNeedsIt: 'Entrepreneurs launching app ideas or established businesses providing dedicated mobile access to their services.',
    features: [
      'iOS & Android Cross-Platform Development (Flutter/React Native)',
      'Native Android & iOS Engineering',
      'Firebase & Custom Cloud Backends',
      'Real-Time Push Notifications & Messaging',
      'In-App Payments & Subscription Engines',
      'Geolocation, Maps & Camera Integrations'
    ],
    deliverables: [
      'Published App Store & Google Play Store Builds',
      'Source Code & Architecture Documentation',
      'Admin Panel for Content & User Management',
      'Post-Launch Performance Monitoring'
    ],
    useCases: [
      'On-demand service booking apps',
      'Health, nutrition & fitness tracking mobile tools',
      'E-commerce & marketplace native shopping apps'
    ],
    faqs: [
      {
        q: 'Do you publish the app to Google Play and Apple App Store for us?',
        a: 'Yes! We manage the entire store submission, compliance, screenshot preparation, and approval process.'
      }
    ]
  },
  {
    id: 'web-development',
    title: 'Website Development',
    category: 'Growth',
    iconName: 'Globe',
    shortDesc: 'Modern corporate websites and web apps that build trust, explain your business clearly, and convert visitors.',
    businessValue: 'Turn casual web traffic into qualified leads with ultra-fast page speed, striking modern design, and clear messaging.',
    technicalDescription: 'Next.js & React single-page / server-rendered applications, structured metadata, schema markup, and responsive layouts.',
    whoNeedsIt: 'Businesses upgrading an outdated website, launching a new corporate brand, or needing high-converting product landing pages.',
    features: [
      'Corporate & Modern Brand Websites',
      'High-Conversion Landing Pages',
      'SaaS & Web Product Interfaces',
      'Responsive Mobile-First Engineering',
      'Technical SEO & Core Web Vitals Optimization',
      'Dynamic CMS & Content Management'
    ],
    deliverables: [
      'Blazing-Fast Web Application',
      'Integrated Contact & Lead Generation Forms',
      'Full SEO Optimization Package',
      'Content Management Training'
    ],
    useCases: [
      'Corporate positioning for tech and service firms',
      'High-converting product launch pages',
      'Interactive customer portals and quote calculators'
    ],
    faqs: [
      {
        q: 'Will my website load quickly on mobile devices?',
        a: 'Absolutely. We build with lightweight modern frameworks and optimize every asset to score top grades on Google Core Web Vitals.'
      }
    ]
  },
  {
    id: 'custom-software',
    title: 'Custom Software Development',
    category: 'Software',
    iconName: 'Code',
    shortDesc: 'Tailor-made software solutions built specifically around your company’s unique operations.',
    businessValue: 'Stop forcing your business into rigid off-the-shelf software. Build tools that match your exact business processes.',
    technicalDescription: 'Modular multi-tier enterprise software architectures, microservices, secure database schemas, and role-based control.',
    whoNeedsIt: 'Growing organizations needing internal management portals, custom ERP/CRM tools, or specialized operational platforms.',
    features: [
      'Business Management Systems & Portals',
      'Custom ERP & CRM Platforms',
      'Internal Operations & Workflow Automation',
      'Role-Based Access Control & Security Audit Logs',
      'Multi-Vendor Marketplace Platforms',
      'Real-Time Reporting & Executive Dashboards'
    ],
    deliverables: [
      'Tailored Enterprise Application',
      'Role-Based Permission Matrix',
      'Data Migration Scripts & Tooling',
      'User Onboarding & System Admin Manuals'
    ],
    useCases: [
      'Custom inventory & warehouse dispatch tracking',
      'Multi-department employee task and approval portals',
      'Specialized client booking and billing hubs'
    ],
    faqs: [
      {
        q: 'How long does custom software development take?',
        a: 'Initial working MVPs are typically ready within 6 to 10 weeks, depending on the complexity of features and integrations.'
      }
    ]
  },
  {
    id: 'saas-development',
    title: 'SaaS Development',
    category: 'Software',
    iconName: 'Layers',
    shortDesc: 'End-to-end subscription-based web and mobile products from MVP to enterprise scale.',
    businessValue: 'Launch recurring revenue products with automated billing, multi-tenant security, and user analytics built in from day one.',
    technicalDescription: 'Multi-tenant database architectures, Stripe billing webhooks, user lifecycle hooks, and high-concurrency cloud scaling.',
    whoNeedsIt: 'Founders and companies building software products to sell to thousands of subscribers or business clients.',
    features: [
      'Subscription & Metered Billing Integration',
      'Multi-Tenant Data Architecture',
      'User Authentication & Team Workspaces',
      'Super-Admin Management Consoles',
      'Usage Analytics & Telemetry Systems',
      'Automated Email & Notification Triggers'
    ],
    deliverables: [
      'Complete Multi-Tenant SaaS Platform',
      'Stripe / Payment Billing Gateway Setup',
      'Admin Monitoring Dashboard',
      'Scalable Cloud Infrastructure Blueprint'
    ],
    useCases: [
      'B2B productivity software tools',
      'Subscription-based analytics platforms',
      'Niche vertical business management tools'
    ],
    faqs: [
      {
        q: 'Can KorvenzaTech help us build an MVP to present to investors?',
        a: 'Yes! We specialize in rapidly shipping clean, functional MVPs that prove market value while keeping codebase quality investment-ready.'
      }
    ]
  },
  {
    id: 'cloud-solutions',
    title: 'Cloud Solutions',
    category: 'Infrastructure',
    iconName: 'Cloud',
    shortDesc: 'Reliable cloud environments hosted on Google Cloud, AWS, or Firebase that scale seamlessly as you grow.',
    businessValue: 'Ensure 99.99% uptime, protect customer data with encrypted backups, and automatically handle spikes in user traffic.',
    technicalDescription: 'Infrastructure-as-Code, Serverless Cloud Run/Lambda, auto-scaling clusters, Firestore/PostgreSQL managed DBs, and Docker.',
    whoNeedsIt: 'Businesses experiencing server slowdowns, high hosting costs, or needing secure cloud architecture for global users.',
    features: [
      'Google Cloud & AWS Cloud Architecture',
      'Serverless & Containerized Deployments (Docker)',
      'Automated Database Backups & Encryption',
      'Load Balancing & High Availability Clusters',
      'Cloud Storage & CDN Acceleration',
      'Cost Optimization & Resource Audits'
    ],
    deliverables: [
      'Configured Cloud Infrastructure',
      'Automated CI/CD Deployment Scripts',
      'Security & Access Rules Matrix',
      'Disaster Recovery Blueprint'
    ],
    useCases: [
      'Migrating local servers to secure managed cloud',
      'Scaling platforms to support 100,000+ concurrent visitors',
      'Setting up automated geo-redundant database backups'
    ],
    faqs: [
      {
        q: 'How do you keep cloud server costs from exploding?',
        a: 'We design serverless and auto-scaling architectures so you only pay for the exact compute power your traffic uses.'
      }
    ]
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    category: 'Applications',
    iconName: 'Layout',
    shortDesc: 'Intuitive visual interfaces designed for maximum clarity, ease of use, and visual sophistication.',
    businessValue: 'Reduce customer drop-off and eliminate user frustration with clean, accessible design that makes complex features feel effortless.',
    technicalDescription: 'Figma design systems, interactive high-fidelity prototypes, user journey mapping, and WCAG accessibility compliance.',
    whoNeedsIt: 'Products with cluttered interfaces, low conversion rates, or new applications requiring polished wireframes and visual identity.',
    features: [
      'Mobile & Web Application UI Design',
      'User Flow & Information Architecture',
      'Interactive High-Fidelity Prototypes',
      'Scalable Design Systems & Component Libraries',
      'Usability Audits & User Experience Refinement',
      'Micro-Interactions & Motion Design Specifications'
    ],
    deliverables: [
      'Interactive Figma Prototypes',
      'Design System Token Library',
      'Developer-Ready Handout Specs',
      'Asset Packages (SVG, WebP, Icons)'
    ],
    useCases: [
      'Redesigning legacy software for modern usability',
      'Crafting new mobile app user journeys from scratch',
      'Designing complex analytical data dashboards'
    ],
    faqs: [
      {
        q: 'Will we be able to test and preview the design before coding starts?',
        a: 'Yes, you will receive interactive clickable prototypes so you can experience the product flow before a single line of code is written.'
      }
    ]
  },
  {
    id: 'digital-marketing',
    title: 'Digital Growth Strategy',
    category: 'Growth',
    iconName: 'TrendingUp',
    shortDesc: 'Data-driven growth strategies to help your software or business reach the right audience and scale.',
    businessValue: 'Attract qualified visitors, improve organic search engine rankings, and convert traffic into long-term customers.',
    technicalDescription: 'Technical SEO audits, schema markup implementation, conversion rate optimization (CRO), and growth analytics setup.',
    whoNeedsIt: 'Companies with newly launched apps or websites looking to acquire users and build a steady pipeline of digital leads.',
    features: [
      'Technical SEO & Search Engine Optimization',
      'Conversion Rate Optimization (CRO)',
      'Content Strategy & Product Messaging',
      'User Acquisition Analytics & Funnel Tracking',
      'Digital Campaign Architecture',
      'Brand & Position Positioning Strategy'
    ],
    deliverables: [
      'Technical SEO Audit & Strategy Map',
      'Analytics & Event Conversion Dashboard',
      'Target Keyword & Audience Strategy Plan'
    ],
    useCases: [
      'Boosting organic Google search visibility',
      'Optimizing landing page conversion rates by 40%+',
      'Setting up multi-channel conversion analytics'
    ],
    faqs: [
      {
        q: 'Is KorvenzaTech a marketing agency?',
        a: 'No. We are a technology company that provides technical growth and SEO strategies as part of building digital products.'
      }
    ]
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'ielts-ai-master',
    name: 'IELTS AI Master',
    category: 'Education Technology',
    industry: 'Education & Testing',
    tagline: 'AI-Powered Language Assessment & Exam Practice Ecosystem',
    summary: 'A comprehensive AI preparation platform that evaluates student speaking, writing, reading, and listening capabilities in real time with human-grade feedback.',
    problem: 'Students preparing for language proficiency exams often lack immediate, detailed feedback on speaking pronunciation and essay writing, requiring expensive human tutors and waiting days for score reports.',
    solution: 'KorvenzaTech architected a multi-modal AI platform integrating custom speech and language processing and natural language evaluation engines to provide instant band scores, detailed grammatical feedback, and personalized improvement plans.',
    coreTech: ['Flutter', 'Firebase Auth', 'Cloud Firestore', 'Multimodal AI', 'Text-to-Speech', 'Speech-to-Text'],
    features: [
      'Real-Time AI Speaking Test Simulator with Speech Audio Analysis',
      'AI Essay & Task Writing Evaluation with Instant Band Scores & Corrections',
      'Interactive Listening & Reading Mock Exams with Automated Marking',
      'Personalized Grammar & Vocabulary Diagnostic Analytics Dashboard',
      'Progress Tracking Across Listening, Reading, Writing & Speaking'
    ],
    platform: 'Android App • Google Play',
    outcome: [
      'Published on Google Play as a live Android product',
      'Combines all four IELTS practice modules in one application',
      'Uses AI-assisted feedback for writing and speaking practice',
      'Stores learner progress securely with Firebase'
    ],
    metrics: [
      { label: 'Status', value: 'Live' },
      { label: 'Modules', value: '4 IELTS' },
      { label: 'Platform', value: 'Android' }
    ],
    imageSrc: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'fitmind-ai',
    name: 'FitMind AI',
    category: 'Health & Wellness',
    industry: 'Fitness & Health Tech',
    tagline: 'Intelligent Nutrition & Workout Companion with Computer Vision',
    summary: 'An AI health application that analyzes meal photos for precise nutritional breakdown and generates adaptive workout routines tailored to daily biometric progress.',
    problem: 'Traditional nutrition apps require tedious manual logging of food items, leading to high user drop-off. Users also struggle with generic workout plans that do not adapt to fatigue or dietary intake.',
    solution: 'KorvenzaTech created a seamless computer-vision mobile application that identifies food items from photos, instantly calculates macro-nutrients, and adjusts fitness regimens dynamically using smart AI algorithms.',
    coreTech: ['Flutter', 'Firebase', 'Multimodal AI', 'Cloud Infrastructure', 'AdMob'],
    features: [
      'Instant Meal Photo Analysis with Food Recognition & Macro Breakdown',
      'AI Coach with personalized nutrition and progress guidance',
      'Hydration, Micro-Nutrient, and Weight Progress Tracking',
      'Daily calories, macros, water and weight progress tracking',
      'AI Fitness Assistant for Instant Science-Backed Health Advice'
    ],
    platform: 'Android App • Google Play',
    outcome: [
      'Published on Google Play as a live Android product',
      'Supports AI-assisted food photo analysis and macro estimation',
      'Includes personalized AI coaching and progress dashboards',
      'Uses Firebase cloud services for authentication and user data'
    ],
    metrics: [
      { label: 'Status', value: 'Live' },
      { label: 'Core', value: 'AI Nutrition' },
      { label: 'Platform', value: 'Android' }
    ],
    imageSrc: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'skilllink',
    name: 'SkillLink',
    category: 'Digital Marketplace',
    industry: 'On-Demand Services & Gig Economy',
    tagline: 'End-to-End Service Marketplace Connecting Clients with Certified Experts',
    summary: 'A robust multi-sided marketplace platform that streamlines the complete job journey — from search, quote generation, and escrow payments to dispatch and verified reviews.',
    problem: 'Connecting home and business owners with reliable service providers was hindered by fragmented communication, unverified ratings, payment disputes, and lack of real-time job tracking.',
    solution: 'KorvenzaTech designed and engineered a unified cross-platform system with role-based mobile apps for providers and clients, coupled with a central dispatcher admin web console and escrow payment security.',
    coreTech: ['Flutter', 'Firebase Auth', 'Cloud Firestore', 'Firebase Storage', 'Google Maps', 'FCM'],
    features: [
      'Real-Time Provider Geolocation & Smart Dispatch Matching',
      'Job request, acceptance and milestone-based workflow',
      'Real-time customer and worker communication flows',
      'Worker/customer role-based dashboards and job history',
      'Provider Identity Verification & Rating Auditing'
    ],
    platform: 'Android App • Google Play',
    outcome: [
      'Published on Google Play as a live marketplace product',
      'Supports separate customer and worker experiences',
      'Implements a complete request-to-completion job lifecycle',
      'Uses Firebase and Google Maps for real-time marketplace workflows'
    ],
    metrics: [
      { label: 'Status', value: 'Live' },
      { label: 'Model', value: 'Marketplace' },
      { label: 'Platform', value: 'Android' }
    ],
    imageSrc: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&auto=format&fit=crop'
  }
];

export const INDUSTRIES_DATA: IndustryItem[] = [
  {
    id: 'healthcare',
    name: 'Healthcare & Biotech',
    iconName: 'Activity',
    tagline: 'Secure, compliant digital tools for patient care and medical data.',
    problemSolved: 'Eliminating paper bottlenecks and fragmented patient records while maintaining strict HIPAA & data privacy compliance.',
    exampleSolutions: ['Telemedicine Portals', 'AI Patient Diagnostics', 'HIPAA-Compliant Messaging', 'Medical Asset Tracking']
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
    problemSolved: 'Building high-throughput financial infrastructure with zero-tolerance for data latency or transaction security errors.',
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
    title: 'Discovery & Consultation',
    description: 'We listen to your goals, analyze your operational challenges, and understand your target audience without confusing technical jargon.',
    deliverable: 'Clear Product Roadmap & Scope Document'
  },
  {
    number: '02',
    title: 'Architecture & Strategy',
    description: 'We select the optimal technology stack, define secure system flows, and structure a budget-conscious development timeline.',
    deliverable: 'Technical System Blueprint & Wireframe Flow'
  },
  {
    number: '03',
    title: 'UX/UI Design',
    description: 'Our design team crafts intuitive, highly interactive screen prototypes so you can preview and refine the user experience before code is written.',
    deliverable: 'Interactive Clickable Figma Prototype'
  },
  {
    number: '04',
    title: 'Agile Engineering',
    description: 'Our senior engineers build your product in transparent 2-week sprints with clean code, modular architecture, and bi-weekly live demos.',
    deliverable: 'Working Application Builds (Staging Link)'
  },
  {
    number: '05',
    title: 'Quality Testing & Security',
    description: 'We rigorously test load performance, mobile responsiveness, edge case handling, and cybersecurity protection before launch.',
    deliverable: 'QA Verification & Security Compliance Certificate'
  },
  {
    number: '06',
    title: 'Deployment & Launch',
    description: 'We handle app store submissions, cloud server provisioning, domain SSL setup, and seamless database migrations.',
    deliverable: 'Live Production Platform & App Store Links'
  },
  {
    number: '07',
    title: 'Growth & Support',
    description: 'We monitor uptime, patch software, update third-party APIs, and continuously help you scale features as your business grows.',
    deliverable: 'SLA Maintenance & Ongoing Optimization'
  }
];

export const TECH_STACK: TechStackCategory[] = [
  {
    category: 'Mobile Applications',
    description: 'Cross-platform and native engineering for smartphones.',
    items: [
      { name: 'Flutter', description: 'Unified iOS and Android codebase with high 60fps performance' },
      { name: 'Android Native (Kotlin)', description: 'Deep hardware and system integration for Android' },
      { name: 'iOS Native (Swift)', description: 'High-performance Apple ecosystem engineering' },
      { name: 'React Native', description: 'Cross-platform mobile apps powered by React' }
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
      { name: 'GraphQL / REST APIs', description: 'Structured communication layers for client applications' }
    ]
  },
  {
    category: 'AI & Intelligence',
    description: 'Generative AI models and smart automation algorithms.',
    items: [
      { name: 'Multimodal AI API', description: 'Multimodal intelligence for text, vision, and reasoning' },
      { name: 'Language AI', description: 'Advanced natural language processing and agent execution' },
      { name: 'RAG Infrastructure', description: 'Private vector search over company documents' },
      { name: 'Computer Vision', description: 'Image recognition and automated inspection models' }
    ]
  },
  {
    category: 'Cloud & Infrastructure',
    description: 'Global hosting environments built for high availability.',
    items: [
      { name: 'Google Cloud Platform', description: 'Enterprise cloud hosting, Cloud Run, and BigQuery' },
      { name: 'Amazon Web Services (AWS)', description: 'Scalable cloud infrastructure, S3, and ECS' },
      { name: 'Docker & Containers', description: 'Consistent application environments across cloud servers' },
      { name: 'CI/CD Pipelines', description: 'Automated testing and zero-downtime deployment' }
    ]
  }
];

export const INSIGHTS_ARTICLES: InsightArticle[] = [
  {
    id: 'ai-integration-guide-2026',
    title: 'How Businesses Can Integrate AI Without Sacrificing Data Security',
    category: 'AI & Automation',
    readTime: '5 min read',
    date: 'August 2, 2026',
    excerpt: 'AI is no longer just for tech giants. Learn how growing organizations can leverage LLMs and RAG architectures safely without exposing proprietary company data.',
    author: { name: 'Engineering Team', role: 'KorvenzaTech Systems Lab' },
    content: `Many executives want to harness artificial intelligence to automate customer service or analyze complex business reports, but worry about data leaks. 

The key lies in private API endpoints, controlled access, and Retrieval-Augmented Generation (RAG). Sensitive business content can remain inside isolated data stores while the application retrieves only the information needed for each approved request.

At KorvenzaTech, we design AI architectures that keep your data strictly private while delivering instant 24/7 intelligence to your customers and team.`
  },
  {
    id: 'native-vs-flutter-apps',
    title: 'Flutter vs Native Apps in 2026: Choosing the Right Strategy for Your Business',
    category: 'App Development',
    readTime: '6 min read',
    date: 'July 18, 2026',
    excerpt: 'Building separate iOS and Android apps doubles development cost and time. Here is why modern cross-platform engineering with Flutter is powering the top business products.',
    author: { name: 'Mobile Product Lead', role: 'KorvenzaTech Engineering' },
    content: `For years, non-technical founders believed they had to write native Swift for iOS and native Kotlin for Android to achieve smooth performance. Modern cross-platform frameworks like Flutter have completely changed the equation.

By maintaining a single clean codebase, you reduce development costs by 40% while launching on both Google Play Store and Apple App Store simultaneously. At KorvenzaTech, our Flutter apps achieve smooth 60fps animations with full hardware access, making them indistinguishable from native apps.`
  },
  {
    id: 'api-first-architecture',
    title: 'Why an API-First Approach Prevents Costly Software Rebuilds',
    category: 'Software Architecture',
    readTime: '4 min read',
    date: 'June 29, 2026',
    excerpt: 'When building software, coupling your database directly to your front-end creates rigid systems. Discover how API-first design keeps your product ready for future apps and tools.',
    author: { name: 'Architectural Director', role: 'KorvenzaTech Cloud Services' },
    content: `When a business builds a website first and later decides to add a mobile app, poorly structured codeforces them to rebuild their backend from scratch.

An API-First architecture solves this by building a clean, secure data layer first. Your website, mobile apps, third-party payment gateways, and AI agents all connect to this central hub. This means adding a new iOS app or web portal in the future takes weeks instead of months.`
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What does KorvenzaTech do?',
    answer: 'KorvenzaTech is a global technology company that designs, builds, automates, and scales digital products. We develop AI systems, mobile applications, custom web platforms, APIs, cloud infrastructure, and technical growth strategies for businesses of all sizes.'
  },
  {
    question: 'Can you help if I only have an idea and no technical background?',
    answer: 'Yes! Over half of our clients are non-technical founders and business owners. You bring the idea or operational challenge, and we guide you through strategy, user experience design, and software engineering in plain English without confusing jargon.'
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
    answer: 'Yes! KorvenzaTech serves businesses, startups, and enterprise clients internationally across North America, Europe, the Middle East, Asia, and worldwide with flexible communication schedules.'
  },
  {
    question: 'Can KorvenzaTech sign an NDA (Non-Disclosure Agreement)?',
    answer: 'Absolutely. We respect intellectual property and are happy to sign a mutual NDA before you share sensitive project details or proprietary business ideas.'
  },
  {
    question: 'How do I start a project with KorvenzaTech?',
    answer: 'Simply click "Start Your Project" or fill out our project inquiry form. Share a brief description of what you want to build, and our team will contact you within 24 hours to schedule a free discovery call.'
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
