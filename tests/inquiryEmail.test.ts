import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildInquiryEmail, bodyFor, mailtoUrl, recipientFor, subjectFor, INFO_EMAIL, SALES_EMAIL, type InquiryData } from '../src/lib/inquiryEmail';

const base: InquiryData = {
  inquiryType: 'Project / Sales', fullName: 'Sarah Jenkins', email: 'sarah@acme.com', companyName: 'Acme Corp', country: 'United Arab Emirates',
  services: ['Mobile App Development', 'AI Solutions & Automation'], budgetRange: '$5,000–$15,000', projectTimeline: '1–3 months',
  ideaDescription: 'We need an app.\nIt should book trainers.', preferredContact: 'WhatsApp',
};
/** Decodes a mailto URL back into its parts (what the mail app receives). */
const parse = (url: string) => {
  const [addr, q] = url.slice('mailto:'.length).split('?');
  const p = new URLSearchParams(q.replace(/\+/g, '%2B'));
  return { to: addr, subject: p.get('subject') ?? '', body: p.get('body') ?? '', raw: q };
};

test('routing: Project / Sales → sales@, all other categories → info@', () => {
  assert.equal(recipientFor('Project / Sales'), SALES_EMAIL);
  assert.equal(recipientFor(undefined), SALES_EMAIL);
  for (const t of ['General Inquiry', 'Partnership', 'Careers'] as const) assert.equal(recipientFor(t), INFO_EMAIL);
  for (const [t, to] of [['Project / Sales', 'sales@korvenzatech.com'], ['General Inquiry', 'info@korvenzatech.com'], ['Partnership', 'info@korvenzatech.com'], ['Careers', 'info@korvenzatech.com']] as const) {
    assert.equal(parse(buildInquiryEmail({ ...base, inquiryType: t }).url).to, to);
  }
});

test('subjects per category (company falls back to the name for projects)', () => {
  assert.equal(subjectFor(base), 'New Project Inquiry – Acme Corp');
  assert.equal(subjectFor({ ...base, companyName: '  ' }), 'New Project Inquiry – Sarah Jenkins');
  assert.equal(subjectFor({ ...base, inquiryType: 'General Inquiry' }), 'General Inquiry – Sarah Jenkins');
  assert.equal(subjectFor({ ...base, inquiryType: 'Partnership' }), 'Partnership Proposal – Sarah Jenkins');
  assert.equal(subjectFor({ ...base, inquiryType: 'Careers' }), 'Career Application – Sarah Jenkins');
});

test('body contains every field, multiple services and the template frame', () => {
  const b = bodyFor(base);
  for (const s of ['Hello KorvenzaTech Team,', 'CONTACT INFORMATION', 'Full Name: Sarah Jenkins', 'Business Email: sarah@acme.com', 'Company: Acme Corp', 'Country: United Arab Emirates',
    'INQUIRY DETAILS', 'Inquiry Type: Project / Sales', 'Required Services: Mobile App Development, AI Solutions & Automation', 'Project Budget: $5,000–$15,000', 'Project Timeline: 1–3 months',
    'PROJECT DESCRIPTION', 'We need an app.\nIt should book trainers.', 'PREFERRED CONTACT METHOD', 'WhatsApp', 'Source: KorvenzaTech Website', 'Website: https://korvenzatech.com/',
    'This email was prepared automatically from the KorvenzaTech contact form.']) assert.ok(b.includes(s), `missing: ${s}`);
});

test('missing optional fields are left out — no empty, undefined or null values', () => {
  const b = bodyFor({ inquiryType: 'General Inquiry', fullName: 'Ali', email: 'ali@x.io', companyName: '', country: undefined, services: [], budgetRange: 'null', projectTimeline: undefined, ideaDescription: 'A general question about your services.', preferredContact: '' });
  for (const s of ['Company:', 'Country:', 'Required Services', 'Project Budget', 'Project Timeline', 'PREFERRED CONTACT METHOD', 'undefined', 'null', ': \n']) assert.ok(!b.includes(s), `should not contain: ${s}`);
  assert.ok(b.includes('Inquiry Type: General Inquiry'));
  assert.ok(!/\n{3,}/.test(b), 'no runs of blank lines');
});

test('special characters, emoji, & + # % ? and line breaks survive encoding', () => {
  const desc = 'Budget & scope: 50% now + 50% later? #MVP 🚀 "quotes" <tags> é ü 中文\nLine 2\r\nLine 3';
  const e = buildInquiryEmail({ ...base, companyName: 'R&D + Co #1', ideaDescription: desc });
  assert.ok(!/[ &#+?"<>\n]/.test(e.url.split('?')[1].replace(/&body=/, '').replace(/^subject=/, '')), 'no raw reserved characters in the query');
  assert.ok(e.url.includes('%0D%0A'), 'line breaks sent as CRLF');
  const back = parse(e.url);
  assert.equal(back.subject, 'New Project Inquiry – R&D + Co #1');
  assert.ok(back.body.replace(/\r\n/g, '\n').includes('Budget & scope: 50% now + 50% later? #MVP 🚀 "quotes" <tags> é ü 中文\nLine 2\nLine 3'));
});

test('long descriptions are kept whole', () => {
  const long = Array.from({ length: 120 }, (_, i) => `Paragraph ${i + 1}: requirements, users and integrations.`).join('\n');
  const e = buildInquiryEmail({ ...base, ideaDescription: long });
  assert.ok(parse(e.url).body.replace(/\r\n/g, '\n').includes(long));
  assert.ok(e.url.length > 5000);
});

test('mailto URL shape', () => {
  assert.equal(mailtoUrl('info@korvenzatech.com', 'Hi there', 'a\nb'), 'mailto:info@korvenzatech.com?subject=Hi%20there&body=a%0D%0Ab');
});
