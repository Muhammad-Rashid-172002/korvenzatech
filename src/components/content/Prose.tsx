import React from 'react';

/** Slug for heading anchors. */
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Inline: **bold** and `code`. */
function inline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    return part;
  });
}

export type ProseHeading = { id: string; text: string };
export const proseHeadings = (body: string): ProseHeading[] =>
  body.split(/\n{2,}/).filter((b) => b.startsWith('## ')).map((b) => ({ text: b.slice(3).trim(), id: slugify(b.slice(3)) }));

/**
 * Renders the simple block format used by articles and legal pages:
 * "## " heading, "- " bullet lines, everything else a paragraph.
 */
export function Prose({ body, className = '' }: { body: string; className?: string }) {
  const blocks = body.trim().split(/\n{2,}/);
  return (
    <div className={`kz-prose ${className}`}>
      {blocks.map((b, i) => {
        const t = b.trim();
        if (t.startsWith('## ')) { const h = t.slice(3).trim(); return <h2 key={i} id={slugify(h)}>{h}</h2>; }
        if (t.startsWith('- ')) return <ul key={i}>{t.split('\n').map((l, k) => <li key={k}>{inline(l.replace(/^-\s+/, ''))}</li>)}</ul>;
        return <p key={i}>{inline(t)}</p>;
      })}
    </div>
  );
}
