import React, { useEffect, useRef, useState } from 'react';
import { Bot, Check, FileText, MessageSquare, Sparkles, Workflow, BookOpen } from 'lucide-react';

type Msg = { from: 'user' | 'ai'; text: string; source?: string };
type Demo = { id: string; label: string; Icon: React.FC<{ className?: string }>; problem: string } & (
  | { kind: 'chat'; messages: Msg[] }
  | { kind: 'flow'; steps: string[] }
  | { kind: 'doc'; fields: [string, string][] }
);

/** Scripted demonstrations (clearly labelled) of the four AI patterns we build. */
const DEMOS: Demo[] = [
  {
    id: 'support', label: 'Support assistant', Icon: MessageSquare, kind: 'chat',
    problem: 'Answers routine customer questions from your own policies — and hands over to a person when unsure.',
    messages: [
      { from: 'user', text: 'Can I change my delivery address after ordering?' },
      { from: 'ai', text: 'Yes, until the order is dispatched. Open Orders → Edit address, or I can send the change request for you now.', source: 'Shipping policy §2' },
      { from: 'user', text: 'Please send it.' },
      { from: 'ai', text: 'Done — a team member will confirm by email. Anything else?' },
    ],
  },
  {
    id: 'knowledge', label: 'Knowledge assistant (RAG)', Icon: BookOpen, kind: 'chat',
    problem: 'Lets staff ask questions about internal documents and get answers with references.',
    messages: [
      { from: 'user', text: 'How many days of annual leave do new employees get?' },
      { from: 'ai', text: 'New employees receive 18 days of annual leave per year, accrued monthly from the start date.', source: 'HR handbook, section 4.1' },
      { from: 'user', text: 'Can unused days be carried over?' },
      { from: 'ai', text: 'Up to 5 days can be carried into the next year with manager approval.', source: 'HR handbook, section 4.3' },
    ],
  },
  {
    id: 'flow', label: 'Workflow automation', Icon: Workflow, kind: 'flow',
    problem: 'Turns an incoming enquiry into a CRM record and a draft reply, with a person approving the final step.',
    steps: ['New enquiry email received', 'Extract name, company and request', 'Classify: sales enquiry · mobile app', 'Create CRM lead', 'Draft reply for review'],
  },
  {
    id: 'doc', label: 'Document intelligence', Icon: FileText, kind: 'doc',
    problem: 'Reads invoices and forms, extracts the fields you need and sends them on for review.',
    fields: [['Invoice no.', 'INV-2087'], ['Vendor', 'Northwind Supplies'], ['Invoice date', '02 Nov'], ['Due date', '30 Nov'], ['Total', '$ 4,250.00']],
  },
];

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Interactive, scripted AI demos for the AI Solutions page. Nothing here calls an AI model. */
export function AiDemos() {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const visible = useRef(false);
  const demo = DEMOS[active];
  const total = demo.kind === 'chat' ? demo.messages.length : demo.kind === 'flow' ? demo.steps.length : demo.fields.length;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Reveal one item at a time while on screen (all at once under reduced motion).
  useEffect(() => {
    if (reduced()) { setShown(total); return; }
    setShown(1);
    const id = window.setInterval(() => {
      if (!visible.current) return;
      setShown((n) => (n >= total + 3 ? 1 : n + 1));
    }, 1100);
    return () => window.clearInterval(id);
  }, [active, total]);

  const tabs = DEMOS.map((d, i) => (
    <button key={d.id} type="button" role="tab" id={`aid-tab-${d.id}`} aria-selected={i === active} aria-controls="aid-panel" tabIndex={i === active ? 0 : -1}
      onClick={() => setActive(i)}
      onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const n = (i + (e.key === 'ArrowRight' ? 1 : DEMOS.length - 1)) % DEMOS.length; setActive(n); document.getElementById(`aid-tab-${DEMOS[n].id}`)?.focus(); } }}
      className={`kz-aid-tab ${i === active ? 'is-on' : ''}`}>
      <d.Icon className="h-4 w-4" aria-hidden="true" />{d.label}
    </button>
  ));

  return (
    <div ref={root} className="kz-aid kz-reveal">
      <div role="tablist" aria-label="AI demonstrations" className="kz-aid-tabs">{tabs}</div>
      <div id="aid-panel" role="tabpanel" aria-labelledby={`aid-tab-${demo.id}`} className="kz-aid-panel">
        <div className="kz-aid-head">
          <p className="text-[14.5px] leading-6 text-[var(--kz-text-2)]">{demo.problem}</p>
          <span className="kz-aid-tag">Scripted demo</span>
        </div>
        <div className="kz-aid-stage" aria-live="off">
          {demo.kind === 'chat' && demo.messages.map((m, i) => (
            <div key={i} className={`kz-aid-msg kz-aid-msg--${m.from} ${i < shown ? 'is-in' : ''}`}>
              {m.from === 'ai' && <span className="kz-aid-ava" aria-hidden="true"><Bot className="h-3.5 w-3.5" /></span>}
              <div><p>{m.text}</p>{m.source && <span className="kz-aid-src">Source: {m.source}</span>}</div>
            </div>
          ))}
          {demo.kind === 'flow' && (
            <ol className="kz-aid-flow">
              {demo.steps.map((s, i) => (
                <li key={s} data-state={i < shown ? 'done' : i === shown ? 'run' : 'wait'}>
                  <span className="kz-aid-dot" aria-hidden="true">{i < shown ? <Check className="h-3 w-3" strokeWidth={3} /> : null}</span>{s}
                  <em>{i < shown ? 'Done' : i === shown ? 'Running' : ''}</em>
                </li>
              ))}
              <li className={`kz-aid-review ${shown >= demo.steps.length ? 'is-in' : ''}`}><Sparkles className="h-4 w-4" aria-hidden="true" />Waiting for a person to approve the reply</li>
            </ol>
          )}
          {demo.kind === 'doc' && (
            <div className="kz-aid-doc">
              <div className="kz-aid-paper" aria-hidden="true">
                <b>INVOICE</b><span>INV-2087</span>
                {Array.from({ length: 7 }, (_, i) => <i key={i} style={{ width: `${40 + ((i * 23) % 45)}%` }} />)}
                <strong>$ 4,250.00</strong>
              </div>
              <dl>
                {demo.fields.map(([k, v], i) => (
                  <div key={k} className={i < shown ? 'is-in' : ''}><dt>{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
            </div>
          )}
        </div>
        <div className="kz-aid-foot">
          <p>These are illustrative, pre-scripted examples — no AI model runs here and the data is invented.</p>
          <button type="button" className="kz-btn kz-btn-secondary !min-h-[42px]" onClick={() => window.dispatchEvent(new Event('kz:open-ai'))}><Bot className="h-4 w-4" aria-hidden="true" />Try our live website assistant</button>
        </div>
      </div>
    </div>
  );
}
