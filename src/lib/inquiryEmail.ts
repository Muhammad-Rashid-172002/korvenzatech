/**
 * Builds the project/contact inquiry email for the website form and the `mailto:` URL that
 * opens it in the visitor's default email app (Gmail, Apple Mail, Outlook… — whichever the
 * device has configured as its mail handler). Pure functions, no DOM access, unit-tested in
 * tests/inquiryEmail.test.ts.
 */

export type InquiryType = 'Project / Sales' | 'General Inquiry' | 'Partnership' | 'Careers';

export interface InquiryData {
  inquiryType?: InquiryType;
  fullName: string;
  email: string;
  companyName?: string;
  country?: string;
  services?: string[];
  budgetRange?: string;
  projectTimeline?: string;
  ideaDescription: string;
  preferredContact?: string;
}

export const SALES_EMAIL = 'sales@korvenzatech.com';
export const INFO_EMAIL = 'info@korvenzatech.com';
const WEBSITE = 'https://korvenzatech.com/';
const RULE = '━━━━━━━━━━━━━━━━━━━━';

/** Project / Sales → sales@; General Inquiry, Partnership, Careers → info@. */
export function recipientFor(type: InquiryType | undefined): string {
  return (type ?? 'Project / Sales') === 'Project / Sales' ? SALES_EMAIL : INFO_EMAIL;
}

/** Trims a value; empty / null / undefined (or the strings "undefined"/"null") become ''. */
const clean = (v: unknown): string => {
  if (v === null || v === undefined) return '';
  const s = String(v).trim();
  return s === 'undefined' || s === 'null' ? '' : s;
};
/** Collapses whitespace for single-line fields (subject, names) so they can't break the layout. */
const oneLine = (v: unknown) => clean(v).replace(/\s+/g, ' ');

export function subjectFor(d: InquiryData): string {
  const name = oneLine(d.fullName);
  const company = oneLine(d.companyName);
  switch (d.inquiryType ?? 'Project / Sales') {
    case 'General Inquiry': return `General Inquiry – ${name}`;
    case 'Partnership': return `Partnership Proposal – ${name}`;
    case 'Careers': return `Career Application – ${name}`;
    default: return `New Project Inquiry – ${company || name}`;
  }
}

/** The email body. Lines whose value is empty are left out; the description keeps its line breaks. */
export function bodyFor(d: InquiryData): string {
  const line = (label: string, value: unknown) => { const v = oneLine(value); return v ? `${label}: ${v}` : ''; };
  const services = (d.services ?? []).map(oneLine).filter(Boolean);
  const description = clean(d.ideaDescription).replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n');
  const contact = oneLine(d.preferredContact);

  /** A titled section; returns '' when it has no non-empty lines. */
  const section = (title: string, lines: string[]) => { const l = lines.filter(Boolean); return l.length ? [title, ...l].join('\n') : ''; };

  return [
    'Hello KorvenzaTech Team,',
    'A new inquiry has been submitted through the KorvenzaTech website.',
    RULE,
    section('CONTACT INFORMATION', [line('Full Name', d.fullName), line('Business Email', d.email), line('Company', d.companyName), line('Country', d.country)]),
    section('INQUIRY DETAILS', [line('Inquiry Type', d.inquiryType ?? 'Project / Sales'), line('Required Services', services.join(', ')), line('Project Budget', d.budgetRange), line('Project Timeline', d.projectTimeline)]),
    section('PROJECT DESCRIPTION', [description]),
    section('PREFERRED CONTACT METHOD', [contact]),
    RULE,
    `Source: KorvenzaTech Website\nWebsite: ${WEBSITE}`,
    'This email was prepared automatically from the KorvenzaTech contact form.',
  ].filter(Boolean).join('\n\n');
}

/**
 * RFC 6068 mailto URL. Subject and body are percent-encoded as UTF-8 (spaces, &, +, #, ?, %,
 * emoji…); line breaks are sent as CRLF (%0D%0A), which every major mail client understands.
 */
export function mailtoUrl(to: string, subject: string, body: string): string {
  const enc = (s: string) => encodeURIComponent(s.replace(/\r?\n/g, '\r\n'));
  return `mailto:${to}?subject=${enc(subject)}&body=${enc(body)}`;
}

export function buildInquiryEmail(d: InquiryData) {
  const to = recipientFor(d.inquiryType);
  const subject = subjectFor(d);
  const body = bodyFor(d);
  return { to, subject, body, url: mailtoUrl(to, subject, body) };
}

/**
 * Some desktop mail apps (notably classic Outlook on Windows) cut mailto links above ~2,000
 * characters. Above this length the form shows a "copy the email" fallback prominently.
 */
export const MAILTO_SAFE_LENGTH = 1900;
