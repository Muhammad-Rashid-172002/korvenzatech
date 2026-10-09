import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '../lib/router';

export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`kz-eyebrow w-fit ${className}`}><span className="kz-eyebrow-dot" aria-hidden="true" />{children}</div>;
}

export function SectionHeader({ eyebrow, title, lead, align = 'left', as: As = 'h2', className = '', children }: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  className?: string;
  children?: React.ReactNode;
}) {
  const center = align === 'center';
  return (
    <div className={`kz-reveal ${center ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      {eyebrow && <Eyebrow className={center ? 'mx-auto' : ''}>{eyebrow}</Eyebrow>}
      <As className="kz-h2 mt-5">{title}</As>
      {lead && <p className={`kz-lead mt-5 ${center ? 'mx-auto' : ''} max-w-2xl`}>{lead}</p>}
      {children}
    </div>
  );
}

export function ButtonLink({ to, children, variant = 'primary', className = '' }: { to: string; children: React.ReactNode; variant?: 'primary' | 'secondary'; className?: string }) {
  return (
    <Link to={to} className={`kz-btn ${variant === 'primary' ? 'kz-btn-primary' : 'kz-btn-secondary'} ${className}`}>
      {children}
      {variant === 'primary' && <ArrowRight className="kz-btn-arrow h-4 w-4" aria-hidden="true" />}
    </Link>
  );
}
