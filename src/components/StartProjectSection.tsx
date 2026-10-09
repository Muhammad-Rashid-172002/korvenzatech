import React, { useId, useRef, useState } from 'react';
import { Sparkles, CheckCircle, Send, Bot, Shield, Clock, AlertCircle } from 'lucide-react';
import { SectionHeader } from './ui';
import { ProjectBriefData } from '../types';

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
    serviceNeeded: 'Not Sure Yet',
    budgetRange: '$5,000–$15,000',
    ideaDescription: '',
    preferredContact: 'Email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [websiteTrap, setWebsiteTrap] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  const servicesList = [
    'AI Solution', 'Mobile App', 'Website', 'Custom Software', 
    'SaaS Platform', 'API Development', 'Cloud Solution', 
    'UI/UX Design', 'Digital Marketing', 'Not Sure Yet'
  ];

  const budgetList = [
    'Under $1,000', '$1,000–$5,000', '$5,000–$15,000', 
    '$15,000–$50,000', '$50,000+', 'Not Sure Yet'
  ];

  const [errors, setErrors] = useState<Partial<Record<'fullName' | 'email' | 'ideaDescription', string>>>({});
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const validate = () => {
    const next: typeof errors = {};
    if (!formData.fullName.trim()) next.fullName = 'Please enter your name.';
    if (!formData.email.trim()) next.email = 'Please enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) next.email = 'Please enter a valid email address, e.g. name@company.com.';
    if (formData.ideaDescription.trim().length < 3) next.ideaDescription = 'Please describe your idea or question in a sentence or two.';
    setErrors(next);
    if (Object.keys(next).length) {
      const firstKey = Object.keys(next)[0];
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus());
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, website: websiteTrap })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'We could not submit your project brief right now.');
      }
      setIsSubmitted(true);
    } catch (err: any) {
      console.error(err);
      const friendly = err instanceof SyntaxError || !err?.message ? 'We could not submit your project brief right now. Please try again, or email sales@korvenzatech.com.' : err.message;
      setSubmitError(friendly);
    } finally {
      setIsSubmitting(false);
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
      if (data.recommendedService) {
        setFormData(prev => ({ ...prev, serviceNeeded: data.recommendedService }));
      }
    } catch (err) {
      console.error('AI Scope Analysis failed:', err);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const field = (key: 'fullName' | 'email' | 'ideaDescription') => ({
    id: `${uid}-${key}`,
    name: key,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${uid}-${key}-error` : undefined,
  });
  const ErrorText = ({ k }: { k: 'fullName' | 'email' | 'ideaDescription' }) => errors[k] ? (
    <p id={`${uid}-${k}-error`} className="kz-error flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />{errors[k]}</p>
  ) : null;
  const chip = (active: boolean) => `min-h-[40px] rounded-full border px-4 text-[13px] font-semibold transition-all duration-300 ${active ? 'border-emerald-600 bg-emerald-700 text-white kz-on-accent shadow-[0_8px_20px_-10px_rgba(25,199,132,.8)]' : 'border-[var(--kz-border-strong)] bg-[var(--kz-surface-2)] text-[var(--kz-text-2)] hover:border-emerald-500/40'}`;
  const update = (patch: Partial<ProjectBriefData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
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
          {isSubmitted ? (
            <div className="animate-in py-12 text-center" role="status" aria-live="polite">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-emerald-500/30 bg-emerald-500/15 text-[var(--kz-accent-text)]">
                <CheckCircle className="h-8 w-8" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-[var(--kz-text)]">Brief received successfully</h3>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-7 text-[var(--kz-text-2)]">Thank you. Our team will review your project details and respond with the most practical next step as soon as possible.</p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ inquiryType: defaultInquiryType, fullName: '', email: '', companyName: '', country: '', serviceNeeded: 'Not Sure Yet', budgetRange: '$5,000–$15,000', ideaDescription: '', preferredContact: 'Email' });
                  setAiAnalysis(null);
                  setSubmitError('');
                  setWebsiteTrap('');
                  setErrors({});
                }}
                className="kz-btn kz-btn-secondary mt-8"
              >
                Submit another brief
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-9 text-left">
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
                  <label htmlFor={`${uid}-email`} className="kz-label">Work email <span className="text-[var(--kz-accent-text)]" aria-hidden="true">*</span></label>
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

              <fieldset>
                <legend className="kz-label">What do you need help with?</legend>
                <div className="flex flex-wrap gap-2">
                  {servicesList.map((srv) => (
                    <button key={srv} type="button" aria-pressed={formData.serviceNeeded === srv} onClick={() => update({ serviceNeeded: srv })} className={chip(formData.serviceNeeded === srv)}>{srv}</button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="kz-label">Estimated project budget</legend>
                <div className="flex flex-wrap gap-2">
                  {budgetList.map((bgt) => (
                    <button key={bgt} type="button" aria-pressed={formData.budgetRange === bgt} onClick={() => update({ budgetRange: bgt })} className={chip(formData.budgetRange === bgt)}>{bgt}</button>
                  ))}
                </div>
              </fieldset>

              <div>
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <label htmlFor={`${uid}-ideaDescription`} className="kz-label !mb-0">Tell us about your idea or business challenge <span className="text-[var(--kz-accent-text)]" aria-hidden="true">*</span></label>
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

              {submitError && (
                <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/[.07] p-4 text-[14px] leading-6 text-[var(--kz-text)]">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="flex flex-col items-start justify-between gap-5 border-t border-[var(--kz-border)] pt-7 sm:flex-row sm:items-center">
                <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="kz-btn kz-btn-primary !min-h-[52px] !px-7 disabled:cursor-wait disabled:opacity-60">
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {isSubmitting ? 'Sending brief…' : 'Discuss my project'}
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
