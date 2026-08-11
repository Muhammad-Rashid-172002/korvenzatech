import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Send, Bot, Shield, Clock } from 'lucide-react';
import { ProjectBriefData } from '../types';

interface StartProjectSectionProps {
  onOpenConsultation?: () => void;
}

export const StartProjectSection: React.FC<StartProjectSectionProps> = ({ onOpenConsultation }) => {
  const [formData, setFormData] = useState<ProjectBriefData>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

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
      setSubmitError(err?.message || 'We could not submit your project brief right now. Please try again.');
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

  return (
    <section id="start-project" className="py-24 bg-[#08090B] relative z-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Your Journey</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Have an Idea? Let's Build Something Valuable.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Tell us what you're trying to build or improve. You don't need technical knowledge — just explain the idea in your own words.
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl glass-panel border border-slate-800 bg-[#17181F] relative overflow-hidden shadow-2xl">
          
          {isSubmitted ? (
            <div className="text-center py-12 space-y-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold text-white">
                Brief Received Successfully!
              </h3>

              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you. Our engineering strategy team will review your project details and contact you within 24 hours.
              </p>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    fullName: '',
                    email: '',
                    companyName: '',
                    country: '',
                    serviceNeeded: 'Not Sure Yet',
                    budgetRange: '$5,000–$15,000',
                    ideaDescription: '',
                    preferredContact: 'Email'
                  });
                  setAiAnalysis(null);
                  setSubmitError('');
                  setWebsiteTrap('');
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700/60"
              >
                Submit Another Brief
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 text-left">
              
              {/* Contact Information Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Full Name <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Work Email <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Company Name <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Country
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. United States, UAE, Germany"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              {/* Service Needed Selection */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">
                  What do you need help with?
                </label>
                <div className="flex flex-wrap gap-2">
                  {servicesList.map((srv) => (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceNeeded: srv })}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        formData.serviceNeeded === srv
                          ? 'bg-indigo-500 text-white border-indigo-400 border shadow-md'
                          : 'bg-slate-900 text-slate-400 border-slate-700/60 border hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      {srv}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range Selection */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">
                  Estimated Project Budget
                </label>
                <div className="flex flex-wrap gap-2">
                  {budgetList.map((bgt) => (
                    <button
                      key={bgt}
                      type="button"
                      onClick={() => setFormData({ ...formData, budgetRange: bgt })}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        formData.budgetRange === bgt
                          ? 'bg-indigo-500 text-white border-indigo-400 border shadow-md'
                          : 'bg-slate-900 text-slate-400 border-slate-700/60 border hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      {bgt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Idea Description Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Tell us about your idea or business challenge
                  </label>

                  <button
                    type="button"
                    onClick={handleRunAiAnalysis}
                    disabled={isAiAnalyzing || !formData.ideaDescription}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1 disabled:opacity-40"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>{isAiAnalyzing ? 'Analyzing Scope...' : 'Analyze Idea with AI Scope Engine'}</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  required
                  placeholder="Explain your goals in plain English... e.g. 'I want to build an iOS and Android app for users to book local fitness trainers and pay via credit card.'"
                  value={formData.ideaDescription}
                  onChange={(e) => setFormData({ ...formData, ideaDescription: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* AI Scope Analysis Results Card */}
              {aiAnalysis && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-mono text-indigo-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Korvenza AI Scope Assessment</span>
                    </span>
                    <span>Est. Timeline: {aiAnalysis.estimatedTimeline}</span>
                  </div>

                  <p className="text-xs text-slate-200">
                    {aiAnalysis.businessValueSummary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {aiAnalysis.suggestedStack?.map((stk: string, sIdx: number) => (
                      <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-[10px] font-mono text-slate-300">
                        {stk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferred Contact Mode */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Preferred Contact Method
                </label>
                <div className="flex gap-4 text-xs text-slate-300">
                  {['Email', 'WhatsApp', 'Video Call'].map((mode) => (
                    <label key={mode} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="preferredContact"
                        value={mode}
                        checked={formData.preferredContact === mode}
                        onChange={() => setFormData({ ...formData, preferredContact: mode as any })}
                        className="accent-indigo-400"
                      />
                      <span>{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Brief...' : 'Discuss My Project'}</span>
                </button>

                <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>NDA Protection Included</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>24h Response SLA</span>
                  </span>
                </div>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
