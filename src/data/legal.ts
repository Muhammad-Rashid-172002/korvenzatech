/**
 * Legal pages (same block format as articles: "## " heading, "- " bullets, paragraphs).
 * Written for a Pakistan-based studio serving EU/UK/US clients, GDPR/UK-GDPR aware.
 * Facts reflect how the site works today (Google Analytics 4 with Consent Mode, Vercel hosting,
 * Google Gemini for the AI assistant, Google Workspace for enquiries).
 * TODO(Rashid): have a lawyer review before relying on these documents.
 */
export type LegalDoc = { slug: 'privacy' | 'terms' | 'cookies'; title: string; description: string; updated: string };

export const LEGAL_UPDATED = '2026-10-30';

export const LEGAL: LegalDoc[] = [
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    description: 'How KorvenzaTech collects, uses, stores and protects personal data from our website, enquiry forms and AI assistant, and the rights you have.',
    updated: LEGAL_UPDATED,
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    description: 'The terms for using the KorvenzaTech website, its content and the Ask Korvenza AI assistant.',
    updated: LEGAL_UPDATED,
  },
  {
    slug: 'cookies',
    title: 'Cookie Policy',
    description: 'The Google Analytics cookies and browser storage korvenzatech.com uses, why, and how to accept, decline or change your choice.',
    updated: LEGAL_UPDATED,
  },
];

export const legalBySlug = (slug: string) => LEGAL.find((d) => d.slug === slug);
