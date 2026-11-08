export interface ServiceCapability {
  name: string;
  /** Case-study ids where this capability is used in a product we built. */
  proof?: string[];
}

export interface ServiceItem {
  id: string;
  /** Primary services get visual priority everywhere; supporting ones sit in the grid. */
  tier: 'primary' | 'supporting';
  title: string;
  /** Shorter label for menus and the project form. */
  shortTitle?: string;
  headline: string;
  shortDesc: string;
  description: string;
  businessValue: string;
  technicalDescription: string;
  iconName: string;
  category: 'AI & Automation' | 'Software' | 'Applications' | 'Infrastructure' | 'Growth';
  features: string[];
  capabilities?: ServiceCapability[];
  problems?: { problem: string; solution: string }[];
  deliverables: string[];
  useCases: string[];
  industries?: { name: string; text: string }[];
  process?: { title: string; text: string }[];
  timeline?: { phase: string; duration: string; text: string }[];
  tech: string[];
  relatedWork: string[];
  whoNeedsIt: string;
  cta: { primary: string; secondary: string; secondaryTo: string };
  faqs: { q: string; a: string }[];
  seo: { title: string; description: string };
}

export interface CaseStudyVisuals {
  /** `recreation` = redrawn from the real app layouts; `concept` = illustrative concept design. */
  kind: 'recreation' | 'concept';
  /** Folder under /media/work with screen-N.webp (+ -540) phone screens. */
  screens: string;
  count: number;
  /** Base name of /media/work/<cover>-{800,1536}.webp. */
  cover: string;
  brand: string;
  accent: string;
  /** Web dashboard images in the screens folder (dashboard-N.webp + -960). */
  dashboards?: string[];
  captions: string[];
}

export interface CaseStudy {
  id: string;
  name: string;
  formerName?: string;
  category: string;
  industry: string;
  headline: string;
  tagline: string;
  summary: string;
  problem: string;
  solution: string;
  coreTech: string[];
  features: string[];
  platform: string;
  status: string;
  packageId?: string;
  outcome: string[];
  metrics: { label: string; value: string }[];
  links: { label: string; href: string }[];
  disclaimer?: string;
  visuals: CaseStudyVisuals;
  relatedServices: string[];
  imageSrc: string;
}

export interface IndustryItem {
  id: string;
  name: string;
  iconName: string;
  tagline: string;
  problemSolved: string;
  exampleSolutions: string[];
}

export interface TechStackCategory {
  category: string;
  description: string;
  items: { name: string; description: string; tag?: string; unconfirmed?: boolean }[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  deliverable: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface ProjectBriefData {
  inquiryType?: 'Project / Sales' | 'General Inquiry' | 'Partnership' | 'Careers';
  fullName: string;
  email: string;
  companyName?: string;
  country: string;
  /** Selected services (multi-select). */
  services: string[];
  budgetRange: string;
  projectTimeline: string;
  ideaDescription: string;
  preferredContact: 'Email' | 'WhatsApp' | 'Video Call';
}

export interface OpenRole {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}
