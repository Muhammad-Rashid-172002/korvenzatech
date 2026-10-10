/**
 * Leadership + client testimonials. Real people only.
 *
 * Testimonials: the quote text is the client's own wording — never edit it.
 * An entry is shown only when it is `complete` (full name + role + a company or a clear
 * project context). Placeholder or partial entries stay here, hidden, until Rashid
 * supplies the missing details (see MASTER_PLAN.md → TODO).
 */
export type Leader = {
  name: string;
  role: string;
  image: string;
  srcSet: string;
  description: string;
  /** TODO(Rashid): LinkedIn profile URL. The icon is hidden while empty. */
  linkedin: string;
};

export const LEADERS: Leader[] = [
  {
    name: 'Muhammad Rashid',
    role: 'Founder & CEO',
    image: '/team/muhammad-rashid.png',
    srcSet: '/media/team/muhammad-rashid-480.webp 480w, /media/team/muhammad-rashid-960.webp 780w',
    description: 'Leads product vision, engineering direction, client solutions, and the long-term technology strategy behind KorvenzaTech.',
    linkedin: '',
  },
  {
    name: 'Muhammad Taha Amir',
    role: 'Co-Founder',
    image: '/team/co-founder.jpg',
    srcSet: '/media/team/co-founder-480.webp 480w, /media/team/co-founder-960.webp 960w',
    description: 'Supports company growth, operations, client coordination, delivery planning, and the leadership systems that keep KorvenzaTech projects moving with clarity.',
    linkedin: '',
  },
  {
    name: 'Suliman',
    role: 'COO (Chief Operating Officer)',
    image: '/team/coo.png',
    srcSet: '/media/team/coo-480.webp 480w, /media/team/coo-960.webp 960w',
    description: 'Oversees day-to-day operations, project execution, and the processes that keep KorvenzaTech delivery running smoothly and on schedule.',
    linkedin: '',
  },
];

export type Testimonial = {
  /** Client's full name (as they agreed to be credited). */
  name: string;
  role: string;
  company?: string;
  country?: string;
  /** Path to a photo the client approved; initials are shown otherwise. */
  photo?: string;
  /** Short project label shown on the card, e.g. "Platform modernization". */
  projectType: string;
  /** Second line under the project label. */
  projectDetail?: string;
  /** The client's words, unedited. */
  quote: string;
  /** Star rating from the source platform, only if the client actually gave one there. */
  rating?: number;
  /** Optional proof link (Fiverr review, LinkedIn recommendation, Clutch). */
  verifyUrl?: string;
  verifyLabel?: string;
  /** false = hidden on the site until the missing details are supplied. */
  complete: boolean;
  /** What is missing (for the TODO list). */
  missing?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Mobile App Client', role: 'Startup Founder', projectType: 'Mobile App Client', projectDetail: 'Startup Product',
    quote: 'KorvenzaTech demonstrated strong Flutter expertise from planning through delivery. The team built a polished, responsive mobile experience with clean architecture, thoughtful UX, and excellent attention to detail. Communication stayed clear throughout the project, and the final product felt stable, professional, and ready for real users.',
    complete: false, missing: 'client full name (currently a placeholder), company/country, optional photo + Fiverr/LinkedIn link',
  },
  {
    name: 'Rony Sultana', role: 'Business Owner', projectType: 'Platform Modernization', projectDetail: 'Scalable System Design',
    quote: 'We had already built our system with another team, but it did not scale well. After working with KorvenzaTech, the platform was rebuilt around a much stronger system design. The difference in architecture, stability, and long-term scalability was clear, and the system has continued to perform reliably.',
    complete: true, missing: 'company + country, optional photo + verification link',
  },
  {
    name: 'Jahid', role: 'Education Client', projectType: 'Education Platform', projectDetail: 'Student Grade Portal',
    quote: 'The student grade portal has significantly streamlined our academic operations. Students can access their grades quickly and securely, while the administrative workload for staff has been reduced. The system is easy to use, dependable, and has made the overall process much more efficient.',
    complete: false, missing: 'full name, role and institution name (+ country)',
  },
  {
    // Same client as above: one consistent role ("Business Owner", was "Entrepreneur").
    name: 'Rony Sultana', role: 'Business Owner', projectType: 'Product Delivery', projectDetail: 'Growth Platform',
    quote: 'KorvenzaTech shipped our platform on time with a smooth, well-managed delivery process. Communication was clear, the architecture was clean, and we finally had a product we could scale with confidence. The team stayed practical, responsive, and focused on the outcome.',
    complete: true, missing: 'confirm this is a second project for the same client (and which role is correct)',
  },
];

export const VISIBLE_TESTIMONIALS = TESTIMONIALS.filter((t) => t.complete);
