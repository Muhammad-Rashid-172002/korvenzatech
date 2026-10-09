import React from 'react';
import { Quote, Star } from 'lucide-react';
import { Eyebrow, SectionHeader } from './ui';
import { useTilt } from '../lib/motion';

type Leader = {
  name: string;
  role: string;
  roleDetail?: string;
  image: string;
  srcSet: string;
  description: string;
};

// Names, roles and photographs are the verified ones already used on the site.
const leaders: Leader[] = [
  {
    name: 'Muhammad Rashid',
    role: 'Founder & CEO',
    image: '/team/muhammad-rashid.png',
    srcSet: '/media/team/muhammad-rashid-480.webp 480w, /media/team/muhammad-rashid-960.webp 780w',
    description: 'Leads product vision, engineering direction, client solutions, and the long-term technology strategy behind KorvenzaTech.',
  },
  {
    name: 'Muhammad Taha Amir',
    role: 'Co-Founder',
    image: '/team/co-founder.jpg',
    srcSet: '/media/team/co-founder-480.webp 480w, /media/team/co-founder-960.webp 960w',
    description: 'Supports company growth, operations, client coordination, delivery planning, and the leadership systems that keep KorvenzaTech projects moving with clarity.',
  },
  {
    name: 'Suliman',
    role: 'COO (Chief Operating Officer)',
    roleDetail: 'Software Engineer',
    image: '/team/coo.png',
    srcSet: '/media/team/coo-480.webp 480w, /media/team/coo-960.webp 960w',
    description: 'Oversees day-to-day operations, project execution, and the processes that keep KorvenzaTech delivery running smoothly and on schedule.',
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

function Portrait({ leader, featured = false, index }: { leader: Leader; featured?: boolean; index: number }) {
  const tiltRef = useTilt<HTMLDivElement>(featured ? 4 : 5, 7);
  const sizes = featured ? '(min-width: 1024px) 460px, (min-width: 640px) 60vw, 92vw' : '(min-width: 1024px) 340px, (min-width: 640px) 45vw, 92vw';
  return (
    <article className="kz-leader kz-reveal group" style={{ '--d': index } as React.CSSProperties} aria-labelledby={`leader-${index}`}>
      <div ref={tiltRef} className="kz-portrait">
        <div className="kz-portrait-tilt">
          <div className="kz-portrait-back" aria-hidden="true" />
          <div className="kz-portrait-frame kz-portrait-reveal">
            <img
              src={leader.image}
              srcSet={leader.srcSet}
              sizes={sizes}
              alt={`Portrait of ${leader.name}, ${leader.role}${leader.roleDetail ? ` and ${leader.roleDetail}` : ''} at KorvenzaTech`}
              loading="lazy"
              decoding="async"
              width={featured ? 960 : 480}
              height={featured ? 1200 : 600}
            />
          </div>
          <div className="kz-portrait-rim" aria-hidden="true" />
          <div className="kz-portrait-meta">
            <span className="kz-portrait-role">{leader.role}</span>
            <h3 id={`leader-${index}`} className={`mt-3 font-extrabold tracking-tight text-white ${featured ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>{leader.name}</h3>
            {leader.roleDetail && <p className="mt-1 text-[13px] font-semibold text-[#A6EBCD]">{leader.roleDetail}</p>}
          </div>
        </div>
      </div>
      <p className={`mt-6 max-w-md leading-7 text-[#C3D1CA] ${featured ? 'text-[15px]' : 'text-[14px]'}`}>{leader.description}</p>
    </article>
  );
}

export const LeadershipTestimonialsSection: React.FC = () => (
  <>
    <section id="leadership" className="kz-leaders kz-cinematic relative overflow-hidden py-[var(--kz-section)]" aria-labelledby="leadership-title">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(50%_40%_at_20%_10%,rgba(25,199,132,.12),transparent_70%),radial-gradient(40%_40%_at_90%_60%,rgba(8,127,91,.16),transparent_70%)]" aria-hidden="true" />
      <div className="kz-container relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="kz-reveal lg:col-span-7">
            <Eyebrow>Leadership</Eyebrow>
            <h2 id="leadership-title" className="kz-h2 mt-5 max-w-[16ch] text-white">Built by people who care about what they create.</h2>
          </div>
          <p className="kz-reveal kz-lead lg:col-span-5" style={{ '--d': 1 } as React.CSSProperties}>
            KorvenzaTech is led by engineers and operators who stay close to the work — connecting product decisions, engineering quality and clear communication on every project.
          </p>
        </div>

        <div className="mt-16 grid gap-12 sm:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Portrait leader={leaders[0]} featured index={0} />
          </div>
          <div className="grid gap-12 sm:grid-cols-2 sm:gap-8 lg:col-span-7 lg:pt-24">
            <Portrait leader={leaders[1]} index={1} />
            <Portrait leader={leaders[2]} index={2} />
          </div>
        </div>
      </div>
    </section>

    <section className="kz-section kz-section-alt" aria-labelledby="testimonials-title">
      <div className="kz-container">
        <SectionHeader
          align="center"
          eyebrow="Client feedback"
          title={<span id="testimonials-title">Confidence is earned in the delivery.</span>}
          lead="Feedback from software, startup, platform and education work."
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {testimonials.map((item, index) => (
            <figure key={`${item.author}-${index}`} className="kz-testimonial-card kz-reveal relative overflow-hidden p-7 sm:p-9" style={{ '--d': index % 2 } as React.CSSProperties}>
              <Quote className="absolute -right-2 -top-3 h-24 w-24 text-emerald-500/[.06]" aria-hidden="true" />
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="text-sm font-bold text-[var(--kz-text)]">{item.label}</div>
                  <div className="kz-meta mt-1.5 !text-[10px]">{item.meta}</div>
                </div>
                <div className="flex gap-0.5" role="img" aria-label="Rated 5 out of 5">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />)}
                </div>
              </div>
              <blockquote className="mt-6 text-[15px] leading-7 text-[var(--kz-text-2)]">“{item.quote}”</blockquote>
              <figcaption className="mt-7 flex items-center gap-3 border-t border-[var(--kz-border)] pt-5">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-sm font-extrabold text-[var(--kz-accent-text)]" aria-hidden="true">{item.author.charAt(0)}</span>
                <span>
                  <span className="block text-sm font-bold text-[var(--kz-text)]">{item.author}</span>
                  <span className="block text-xs text-[var(--kz-muted)]">{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  </>
);
