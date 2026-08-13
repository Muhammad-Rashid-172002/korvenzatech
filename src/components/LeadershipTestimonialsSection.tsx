import React from 'react';
import { ArrowUpRight, BadgeCheck, Quote, ShieldCheck, Sparkles, Star, Users } from 'lucide-react';

const leaders = [
  {
    name: 'Muhammad Rashid',
    role: 'Founder & CEO',
    image: '/team/muhammad-rashid.png',
    description: 'Leads product vision, engineering direction, client solutions, and the long-term technology strategy behind KorvenzaTech.',
    icon: Sparkles,
  },
  {
    name: 'Co-Founder',
    role: 'Leadership & Operations',
    image: '/team/co-founder.jpg',
    description: 'Supports delivery operations, client coordination, quality processes, and the systems that keep projects moving with clarity.',
    icon: Users,
  },
];

const testimonials = [
  {
    label: 'Mobile App Client', meta: 'Startup Product',
    quote: 'KorvenzaTech demonstrated strong Flutter expertise from planning through delivery. The team built a polished, responsive mobile experience with clean architecture, thoughtful UX, and excellent attention to detail. Communication stayed clear throughout the project, and the final product felt stable, professional, and ready for real users.',
    author: 'Mobile App Client', role: 'Startup Founder',
  },
  {
    label: 'Platform Modernization', meta: 'Scalable System Design',
    quote: 'We had already built our system with another team, but it did not scale well. After working with KorvenzaTech, the platform was rebuilt around a much stronger system design. The difference in architecture, stability, and long-term scalability was clear, and the system has continued to perform reliably.',
    author: 'Rony Sultana', role: 'Business Owner',
  },
  {
    label: 'Education Platform', meta: 'Student Grade Portal',
    quote: 'The student grade portal has significantly streamlined our academic operations. Students can access their grades quickly and securely, while the administrative workload for staff has been reduced. The system is easy to use, dependable, and has made the overall process much more efficient.',
    author: 'Jahid', role: 'Education Client',
  },
  {
    label: 'Product Delivery', meta: 'Growth Platform',
    quote: 'KorvenzaTech shipped our platform on time with a smooth, well-managed delivery process. Communication was clear, the architecture was clean, and we finally had a product we could scale with confidence. The team stayed practical, responsive, and focused on the outcome.',
    author: 'Rony Sultana', role: 'Entrepreneur',
  },
];

export const LeadershipTestimonialsSection: React.FC = () => (
  <section className="relative overflow-hidden border-t border-white/5 bg-[#070a0d] py-24">
    <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_15%_10%,rgba(16,185,129,.10),transparent_30%),radial-gradient(circle_at_85%_40%,rgba(59,130,246,.08),transparent_28%)]" />
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="kz-eyebrow w-fit"><BadgeCheck className="h-3.5 w-3.5" /> Leadership</div>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Leadership that stays close to the work.</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">A focused leadership model built around direct communication, accountable delivery and product decisions that connect engineering with business outcomes.</p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[.035] px-4 py-3 text-xs text-slate-300">
          <ShieldCheck className="h-4 w-4 text-emerald-300" /> Product-first • Engineering-led • Client-focused
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {leaders.map(({ name, role, image, description, icon: Icon }) => (
          <article key={role} className="premium-card group flex flex-col items-center gap-6 p-7 text-center sm:flex-row sm:text-left sm:p-9">
            <div className="relative shrink-0">
              <div className="h-36 w-36 rounded-full bg-gradient-to-br from-emerald-300 via-cyan-300 to-indigo-400 p-[2px] shadow-[0_20px_55px_rgba(16,185,129,.14)] sm:h-40 sm:w-40">
                <div className="h-full w-full overflow-hidden rounded-full border-[5px] border-[#0b1118] bg-slate-900">
                  <img src={image} alt={`${name} — ${role} at KorvenzaTech`} loading="lazy" className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.035]" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#0b1118] bg-emerald-500 text-white shadow-xl"><Icon className="h-5 w-5" /></div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-emerald-300">{role}</div>
              <h3 className="mt-4 text-2xl font-extrabold text-white">{name}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-emerald-300">KorvenzaTech leadership <ArrowUpRight className="h-3.5 w-3.5" /></div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-24 text-center">
        <div className="kz-eyebrow mx-auto w-fit"><Quote className="h-3.5 w-3.5" /> Client feedback</div>
        <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Confidence is earned in the delivery.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">Feedback from software, startup, platform and education work.</p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {testimonials.map((item, index) => (
          <article key={`${item.author}-${index}`} className="kz-testimonial-card group relative overflow-hidden p-7 sm:p-8">
            <Quote className="absolute -right-2 -top-4 h-24 w-24 text-white/[.025]" />
            <div className="flex items-start justify-between gap-5">
              <div><div className="text-sm font-bold text-white">{item.label}</div><div className="mt-1 text-[11px] uppercase tracking-[.14em] text-slate-500">{item.meta}</div></div>
              <div className="flex gap-0.5" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />)}</div>
            </div>
            <p className="mt-7 text-[15px] leading-7 text-slate-300">“{item.quote}”</p>
            <div className="mt-7 flex items-center gap-3 border-t border-white/7 pt-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/15 bg-emerald-400/10 text-sm font-extrabold text-emerald-300">{item.author.charAt(0)}</div>
              <div><div className="text-sm font-bold text-white">{item.author}</div><div className="text-xs text-slate-500">{item.role}</div></div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
