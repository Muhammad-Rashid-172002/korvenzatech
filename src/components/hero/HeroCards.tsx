import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, Check, Sparkles } from 'lucide-react';
import { AGENT_LOOP } from './heroConfig';
import { useInView } from './useHeroMotion';

const GRAPH = 'M0 70 C 22 66, 30 52, 50 54 S 82 40, 100 44 S 132 22, 152 30 S 186 12, 210 8';

/** Floating analytics card. Sample numbers only — labelled as demo data. */
export const AnalyticsCard: React.FC = () => (
  <div className="kzh-card kzh-analytics">
    <div className="kzh-card-head">
      <span className="kzh-card-title">Analytics</span>
      <span className="kzh-tag">Demo data</span>
    </div>
    <dl className="kzh-kpis">
      <div><dt>Total users</dt><dd>24.8k</dd></div>
      <div><dt>Revenue</dt><dd>$86.4k</dd></div>
      <div><dt>Growth</dt><dd className="kzh-up">+32%</dd></div>
    </dl>
    <svg className="kzh-graph" viewBox="0 0 210 80" preserveAspectRatio="none">
      <defs>
        <linearGradient id="kzh-graph-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#19C784" stopOpacity=".32" />
          <stop offset="1" stopColor="#19C784" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 20 H210 M0 45 H210 M0 70 H210" className="kzh-graph-grid" />
      <path d={`${GRAPH} V80 H0 Z`} className="kzh-graph-area" fill="url(#kzh-graph-fill)" />
      <path d={GRAPH} className="kzh-graph-line" pathLength={100} />
      <circle cx="210" cy="8" r="3.5" className="kzh-graph-dot" />
    </svg>
  </div>
);

const AGENT_STEPS = ['Read contract', 'Extract key fields', 'Create CRM record', 'Generate invoice', 'Draft welcome email'] as const;
const TOTAL = AGENT_STEPS.length;

/**
 * "Korvenza AI Agent" — a visual demo of a document-to-onboarding workflow. Nothing is connected:
 * the steps advance on a timer while the card is on screen (static, all done, under reduced motion).
 * `step` = index of the running step; TOTAL..TOTAL+holdSteps-1 = finished state held before looping.
 */
export const AgentCard: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  const stop = useCallback(() => { window.clearInterval(timer.current); timer.current = undefined; }, []);
  useInView(ref, (inView) => {
    stop();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStep(TOTAL); return; }
    if (inView) timer.current = window.setInterval(() => setStep((s) => (s + 1) % (TOTAL + AGENT_LOOP.holdSteps)), AGENT_LOOP.stepMs);
  });
  useEffect(() => stop, [stop]);

  const done = Math.min(step, TOTAL);
  const openAssistant = () => window.dispatchEvent(new Event('kz:open-ai'));

  return (
    <figure ref={ref} className="kzh-card kzh-agent" aria-label="Korvenza AI Agent — illustrative workflow demo">
      <div className="kzh-card-head">
        <span className="kzh-card-title"><span className="kzh-agent-ico"><Bot className="h-3.5 w-3.5" aria-hidden="true" /></span>Korvenza AI Agent</span>
        <span className="kzh-tag">Demo</span>
      </div>
      <ol className="kzh-steps">
        {AGENT_STEPS.map((label, i) => {
          const state = i < done ? 'done' : i === step ? 'run' : 'wait';
          return (
            <li key={label} data-state={state}>
              <span className="kzh-step-ico" aria-hidden="true">{state === 'done' ? <Check className="h-3 w-3" strokeWidth={3} /> : null}</span>
              <span className="kzh-step-label">{label}</span>
              <span className="kzh-step-state">{state === 'done' ? 'Done' : state === 'run' ? 'Running' : ''}</span>
            </li>
          );
        })}
      </ol>
      <div className="kzh-agent-foot">
        <div className="kzh-progress" aria-hidden="true"><i style={{ transform: `scaleX(${done / TOTAL})` }} /></div>
        <span className="kzh-progress-label" aria-hidden="true">{done}/{TOTAL}</span>
        <button type="button" className="kzh-agent-cta" onClick={openAssistant} data-analytics-ignore="">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />Ask Korvenza AI
        </button>
      </div>
    </figure>
  );
};
