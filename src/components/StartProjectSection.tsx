import { trackEvent } from '../lib/analytics';
import React, { useEffect, useId, useRef, useState } from 'react';
import { Sparkles, Bot, Shield, Clock, AlertCircle, ArrowRight, Copy, Mail, MailCheck, Check } from 'lucide-react';
import { buildInquiryEmail, MAILTO_SAFE_LENGTH } from '../lib/inquiryEmail';
import { SectionHeader } from './ui';
import { ProjectBriefData } from '../types';
import { SERVICES_DATA, SERVICE_OPTIONS } from '../data/companyData';

interface StartProjectSectionProps {
  onOpenConsultation?: () => void;
  defaultInquiryType?: 'Project / Sales' | 'General Inquiry' | 'Partnership' | 'Careers';
}

export const StartProjectSection: React.FC<StartProjectSectionProps> = ({ onOpenConsultation, defaultInquiryType = 'Project / Sales' }) => {
  const [formData, setFormData] = useState<ProjectBriefData>({
    inquiryType: defaultInquiryType,
    fullName: '',
    email: '',
    companyName: '',
    country: '',
    services: [],
    budgetRange: '',
    projectTimeline: '',
    ideaDescription: '',
    preferredContact: 'Email'
  });

  // /start-project?service=<service id> (from the service cards) preselects that service.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('service');
    const svc = id ? SERVICES_DATA.find((s) => s.id === id) : undefined;
    if (svc) setFormData((prev) => (prev.services.length ? prev : { ...prev, services: [svc.shortTitle ?? svc.title] }));
  }, []);

  // The prepared email (after "Discuss my project"): shown in the confirmation panel so the
  // visitor can reopen it or copy it. The form keeps every entered value.
  const [prepared, setPrepared] = useState<ReturnType<typeof buildInquiryEmail> | null>(null);
  const [copied, setCopied] = useState<'idle' | 'done' | 'failed'>('idle');
  const statusRef = useRef<HTMLDivElement>(null);
  const [websiteTrap, setWebsiteTrap] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  const servicesList = SERVICE_OPTIONS;
  const budgetList = ['Under $1,000', '$1,000–$5,000', '$5,000–$15,000', '$15,000–$50,000', '$50,000+', 'Not sure yet'];
  const timelineList = ['As soon as possible', 'Within 1 month', '1–3 months', '3–6 months', 'Flexible'];

  type FieldKey = 'fullName' | 'email' | 'services' | 'ideaDescription';
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  // GA4: form_start once per form instance (first focus); form_submit (delivery: mailto) when the
  // email is prepared. No generate_lead: the site cannot know whether the visitor sends the email.
  // Only the form type is sent — never field contents.
  const startedRef = useRef(false);
  // The brief is turned into an email by JavaScript (mailto:). Until the page has hydrated the
  // submit button stays disabled, so a native (pre-hydration or no-JS) submission can't happen;
  // method="post" additionally keeps field values out of the URL if one ever did.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const formType = defaultInquiryType === 'Project / Sales' ? 'project_brief' : 'contact';
  const onFormFocus = () => { if (!startedRef.current) { startedRef.current = true; trackEvent('form_start', { form_type: formType, form_id: 'start_project' }); } };

  const validate = () => {
    const next: typeof errors = {};
    if (!formData.fullName.trim()) next.fullName = 'Please enter your name.';
    if (!formData.email.trim()) next.email = 'Please enter your email address.';
    else if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(formData.email.trim())) next.email = 'Please enter a valid email address, e.g. name@company.com.';
    if (formData.inquiryType === 'Project / Sales' && !formData.services.length) next.services = 'Please choose at least one service (or “Other”).';
    if (formData.ideaDescription.trim().length < 20) next.ideaDescription = 'Please describe your project in a sentence or two (at least 20 characters).';
    setErrors(next);
    if (Object.keys(next).length) {
      const firstKey = Object.keys(next)[0];
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"], [data-field="${firstKey}"] button`)?.focus());
      return false;
    }
    return true;
  };

  /** Opens the visitor's default email app with the prepared message (whatever app the OS uses for mailto:). */
  const openComposer = (url: string) => { window.location.href = url; };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (websiteTrap) return; // honeypot filled: almost certainly a bot

    const email = buildInquiryEmail(formData);
    setPrepared(email);
    setCopied('idle');
    openComposer(email.url);
    const inquiry = (formData.inquiryType ?? 'Project / Sales').toLowerCase().replace(/[^a-z]+/g, '_');
    trackEvent('form_submit', { form_type: formType, form_id: 'start_project', inquiry_type: inquiry, delivery: 'mailto' });
    startedRef.current = false;
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const copyEmail = async () => {
    if (!prepared) return;
    const text = `To: ${prepared.to}\nSubject: ${prepared.subject}\n\n${prepared.body}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied('done');
    } catch {
      setCopied('failed');
    }
  };

  const handleRunAiAnalysis = async () => {
    if (!formData.ideaDescription || formData.ideaDescription.trim().length < 5) return;

    setIsAiAnalyzing(true);
    try {
      const res = await fetch('/api/ai-scope-analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: formData.ideaDescription })
      });
      const data = await res.json();
      if (!res.ok || data?.error) throw new Error(data?.error || 'Scope analysis unavailable');
      setAiAnalysis(data);
      if (data.recommendedService && SERVICE_OPTIONS.includes(data.recommendedService)) {
        setFormData(prev => (prev.services.includes(data.recommendedService) ? prev : { ...prev, services: [...prev.services, data.recommendedService] }));
      }
    } catch (err) {
      console.error('AI Scope Analysis failed:', err);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const toggleService = (srv: string) => update({ services: formData.services.includes(srv) ? formData.services.filter((x) => x !== srv) : [...formData.services, srv] });

  const field = (key: FieldKey) => ({
    id: `${uid}-${key}`,
    name: key,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${uid}-${key}-error` : undefined,
  });
  const ErrorText = ({ k }: { k: FieldKey }) => errors[k] ? (
    <p id={`${uid}-${k}-error`} className="kz-error flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />{errors[k]}</p>
  ) : null;
  const chip = (active: boolean) => `min-h-[40px] rounded-full border px-4 text-[13px] font-semibold transition-all duration-300 ${active ? 'border-emerald-600 bg-emerald-700 text-white kz-on-accent shadow-[0_8px_20px_-10px_rgba(25,199,132,.8)]' : 'border-[var(--kz-border-strong)] bg-[var(--kz-surface-2)] text-[var(--kz-text-2)] hover:border-emerald-500/40'}`;
  const update = (patch: Partial<ProjectBriefData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    if (prepared) setPrepared(null); // edits after preparing → the confirmation no longer matches
    const keys = Object.keys(patch) as (keyof typeof errors)[];
    if (keys.some((k) => errors[k])) setErrors((prev) => { const n = { ...prev }; keys.forEach((k) => delete n[k]); return n; });
  };

  return (
    <section id="start-project" className="kz-section kz-section-alt relative z-10" aria-labelledby={`${uid}-title`}>
      <div className="kz-container">
        <SectionHeader
          align="center"
          eyebrow="Start your journey"
          title={<span id={`${uid}-title`}>Have an idea? Let’s build something valuable.</span>}
          lead="Tell us what you’re trying to build or improve. You don’t need technical knowledge — just explain the idea in your own words."
        />

        <div className="kz-reveal relative mx-auto mt-14 max-w-4xl overflow-hidden rounded-[var(--kz-radius-xl)] border border-[var(--kz-border)] bg-[var(--kz-surface)] p-6 shadow-[var(--kz-shadow-md)] sm:p-12">
          {(
            <form ref={formRef} method="post" onSubmit={handleSubmit} onFocus={onFormFocus} noValidate className="space-y-9 text-left">
              <noscript>
                <p className="rounded-2xl border border-[var(--kz-border)] p-4 text-[14px] leading-6 text-[var(--kz-text)]">This form needs JavaScript. Please email <a href="mailto:sales@korvenzatech.com" className="font-semibold underline">sales@korvenzatech.com</a> instead.</p>
              </noscript>
              {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor={`${uid}-website`}>Website</label>
                <input id={`${uid}-website`} type="text" tabIndex={-1} autoComplete="off" value={websiteTrap} onChange={(e) => setWebsiteTrap(e.target.value)} />
              </div>

              <fieldset>
                <legend className="kz-label">What can we help with?</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {['Project / Sales', 'General Inquiry', 'Partnership', 'Careers'].map((type) => (
                    <button key={type} type="button" aria-pressed={formData.inquiryType === type} onClick={() => update({ inquiryType: type as ProjectBriefData['inquiryType'] })} className={`${chip(formData.inquiryType === type)} !rounded-xl`}>{type}</button>
                  ))}
                </div>
                <p className="mt-3 text-[12px] text-[var(--kz-muted)]">Project / Sales briefs route to sales@korvenzatech.com. General, partnership and careers enquiries route to info@korvenzatech.com.</p>
              </fieldset>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${uid}-fullName`} className="kz-label">Full name <span className="text-[var(--kz-accent-text)]" aria-hidden="true">*</span></label>
                  <input {...field('fullName')} type="text" autoComplete="name" required placeholder="e.g. Sarah Jenkins" value={formData.fullName} onChange={(e) => update({ fullName: e.target.value })} className="kz-field" />
                  <ErrorText k="fullName" />
                </div>
                <div>
                  <label htmlFor={`${uid}-email`} className="kz-label">Business email <span className="text-[var(--kz-accent-text)]" aria-hidden="true">*</span></label>
                  <input {...field('email')} type="email" autoComplete="email" inputMode="email" required placeholder="e.g. sarah@company.com" value={formData.email} onChange={(e) => update({ email: e.target.value })} className="kz-field" />
                  <ErrorText k="email" />
                </div>
                <div>
                  <label htmlFor={`${uid}-company`} className="kz-label">Company name <span className="font-normal text-[var(--kz-muted)]">(optional)</span></label>
                  <input id={`${uid}-company`} name="companyName" type="text" autoComplete="organization" placeholder="e.g. Acme Corp" value={formData.companyName} onChange={(e) => update({ companyName: e.target.value })} className="kz-field" />
                </div>
                <div>
                  <label htmlFor={`${uid}-country`} className="kz-label">Country</label>
                  <input id={`${uid}-country`} name="country" type="text" autoComplete="country-name" placeholder="e.g. United States, UAE, Germany" value={formData.country} onChange={(e) => update({ country: e.target.value })} className="kz-field" />
                </div>
              </div>

              <fieldset data-field="services" aria-describedby={errors.services ? `${uid}-services-error` : undefined}>
                <legend className="kz-label">Required services {formData.inquiryType === 'Project / Sales' && <span className="text-[var(--kz-accent-text)]" aria-hidden="true">*</span>} <span className="font-normal text-[var(--kz-muted)]">— select all that apply</span></legend>
                <div className="flex flex-wrap gap-2">
                  {servicesList.map((srv) => {
                    const on = formData.services.includes(srv);
                    return (
                      <button key={srv} type="button" aria-pressed={on} onClick={() => toggleService(srv)} className={`${chip(on)} inline-flex items-center gap-1.5`}>
                        {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}{srv}
                      </button>
                    );
                  })}
                </div>
                <ErrorText k="services" />
              </fieldset>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${uid}-budget`} className="kz-label">Project budget <span className="font-normal text-[var(--kz-muted)]">(optional)</span></label>
                  <select id={`${uid}-budget`} name="budgetRange" value={formData.budgetRange} onChange={(e) => update({ budgetRange: e.target.value })} className="kz-field">
                    <option value="">Select a range</option>
                    {budgetList.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor={`${uid}-timeline`} className="kz-label">Project timeline <span className="font-normal text-[var(--kz-muted)]">(optional)</span></label>
                  <select id={`${uid}-timeline`} name="projectTimeline" value={formData.projectTimeline} onChange={(e) => update({ projectTimeline: e.target.value })} className="kz-field">
                    <option value="">Select a timeline</option>
                    {timelineList.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <label htmlFor={`${uid}-ideaDescription`} className="kz-label !mb-0">Project description <span className="text-[var(--kz-accent-text)]" aria-hidden="true">*</span></label>
                  <button type="button" onClick={handleRunAiAnalysis} disabled={isAiAnalyzing || !formData.ideaDescription} className="inline-flex items-center gap-1.5 self-start font-mono text-[11.5px] text-[var(--kz-accent-text)] hover:underline disabled:opacity-40">
                    <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                    {isAiAnalyzing ? 'Analyzing scope…' : 'Analyze idea with AI scope engine'}
                  </button>
                </div>
                <textarea
                  {...field('ideaDescription')}
                  rows={5}
                  required
                  placeholder="Explain your goals in plain English, e.g. ‘I want an iOS and Android app for users to book local fitness trainers and pay by card.’"
                  value={formData.ideaDescription}
                  onChange={(e) => update({ ideaDescription: e.target.value })}
                  className="kz-field mt-2 resize-y"
                />
                <ErrorText k="ideaDescription" />
              </div>

              {aiAnalysis && (
                <div className="animate-in space-y-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/[.05] p-5" aria-live="polite">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[12px] font-bold text-[var(--kz-accent-text)]">
                    <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4" aria-hidden="true" />Korvenza AI scope assessment</span>
                    {aiAnalysis.estimatedTimeline && <span>Est. timeline: {aiAnalysis.estimatedTimeline}</span>}
                  </div>
                  <p className="text-[14px] leading-6 text-[var(--kz-text-2)]">{aiAnalysis.businessValueSummary}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {aiAnalysis.suggestedStack?.map((stk: string) => <span key={stk} className="kz-tech-pill">{stk}</span>)}
                  </div>
                </div>
              )}

              <fieldset>
                <legend className="kz-label">Preferred contact method</legend>
                <div className="flex flex-wrap gap-5 text-[14px] text-[var(--kz-text-2)]">
                  {['Email', 'WhatsApp', 'Video Call'].map((mode) => (
                    <label key={mode} className="flex min-h-[40px] cursor-pointer items-center gap-2">
                      <input type="radio" name="preferredContact" value={mode} checked={formData.preferredContact === mode} onChange={() => update({ preferredContact: mode as ProjectBriefData['preferredContact'] })} className="h-4 w-4 accent-emerald-600" />
                      <span>{mode}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {prepared && (
                <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="kz-mail-ready animate-in">
                  <div className="flex items-start gap-3">
                    <span className="kz-mail-ready-icon"><MailCheck className="h-5 w-5" aria-hidden="true" /></span>
                    <div className="min-w-0">
                      <p className="text-[15px] font-bold text-[var(--kz-text)]">Your email is ready. Please review and send it to our team.</p>
                      <p className="mt-1 text-[13px] leading-6 text-[var(--kz-text-2)]">It is addressed to <b className="whitespace-nowrap text-[var(--kz-accent-text)]">{prepared.to}</b> with the subject “{prepared.subject}”. Nothing is sent until you press Send in your email app.</p>
                      <p className="mt-1 text-[12.5px] leading-5 text-[var(--kz-muted)]">
                        {prepared.url.length > MAILTO_SAFE_LENGTH
                          ? 'Your message is long — if your email app shows it shortened, use “Copy email” and paste it instead.'
                          : 'No email app opened? Copy the email and send it from any mail account.'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <a href={prepared.url} className="kz-btn kz-btn-secondary !min-h-[42px] !text-[13px]"><Mail className="h-4 w-4" aria-hidden="true" />Open email again</a>
                    <button type="button" onClick={copyEmail} className="kz-btn kz-btn-secondary !min-h-[42px] !text-[13px]"><Copy className="h-4 w-4" aria-hidden="true" />{copied === 'done' ? 'Copied' : 'Copy email'}</button>
                  </div>
                  {copied === 'failed' && <p className="mt-2 text-[12.5px] text-[var(--kz-muted)]">Copying isn’t available in this browser. Please email <a className="font-semibold underline" href={`mailto:${prepared.to}`}>{prepared.to}</a> directly.</p>}
                </div>
              )}

              <div className="flex flex-col items-start justify-between gap-5 border-t border-[var(--kz-border)] pt-7 sm:flex-row sm:items-center">
                <button type="submit" disabled={!ready} className="kz-btn kz-btn-primary kz-submit-btn !min-h-[52px] !px-7 disabled:cursor-wait disabled:opacity-60">
                  Discuss my project
                  <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" />
                </button>
                <div className="flex flex-wrap items-center gap-4 font-mono text-[12px] text-[var(--kz-muted)]">
                  <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />NDA available on request</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />Clear follow-up process</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
