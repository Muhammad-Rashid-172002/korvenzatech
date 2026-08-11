export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  businessValue: string;
  technicalDescription: string;
  iconName: string;
  category: 'AI & Automation' | 'Software' | 'Applications' | 'Infrastructure' | 'Growth';
  features: string[];
  deliverables: string[];
  useCases: string[];
  whoNeedsIt: string;
  faqs: { q: string; a: string }[];
}

export interface CaseStudy {
  id: string;
  name: string;
  category: string;
  industry: string;
  tagline: string;
  summary: string;
  problem: string;
  solution: string;
  coreTech: string[];
  features: string[];
  platform: string;
  outcome: string[];
  metrics: { label: string; value: string }[];
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
  items: { name: string; description: string; tag?: string }[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  deliverable: string;
}

export interface InsightArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  content: string;
  author: { name: string; role: string };
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface ProjectBriefData {
  fullName: string;
  email: string;
  companyName?: string;
  country: string;
  serviceNeeded: string;
  budgetRange: string;
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
