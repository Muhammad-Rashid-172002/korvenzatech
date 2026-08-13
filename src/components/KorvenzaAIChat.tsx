import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUp,
  Bot,
  Check,
  ChevronDown,
  Copy,
  Loader2,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

type Role = 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: Role;
  text: string;
  createdAt: number;
};

type ChatResponse = {
  reply: string;
  suggestions?: string[];
  memory?: string;
  configured?: boolean;
};

const CHAT_KEY = 'korvenza_ai_chat_v3';
const MEMORY_KEY = 'korvenza_ai_memory_v3';
const SUGGESTIONS_KEY = 'korvenza_ai_suggestions_v3';

const initialSuggestions = [
  'I want to build an AI app',
  'Which service is right for my business?',
  'Help me plan a software project',
];

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Keeps assistant formatting readable without exposing raw formatting symbols.
 * This renderer intentionally avoids dangerouslySetInnerHTML.
 */
function cleanMarkdownNoise(value: string) {
  return value
    .replace(/\r/g, '')
    .replace(/^\s{0,3}#{1,6}\s*/gm, '')
    .replace(/^\s*[*+-]\s+(?=\S)/gm, '• ')
    .replace(/^\s*>\s?/gm, '')
    .replace(/\*\*\*/g, '')
    .replace(/___/g, '');
}

type InlineToken =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'italic'; value: string }
  | { type: 'code'; value: string };

function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|_[^_\n]+_)/g;
  let lastIndex = 0;

  text.replace(regex, (match, _group, offset) => {
    if (offset > lastIndex) {
      tokens.push({ type: 'text', value: text.slice(lastIndex, offset) });
    }

    if (match.startsWith('`')) {
      tokens.push({ type: 'code', value: match.slice(1, -1) });
    } else if (match.startsWith('**') || match.startsWith('__')) {
      tokens.push({ type: 'bold', value: match.slice(2, -2) });
    } else {
      tokens.push({ type: 'italic', value: match.slice(1, -1) });
    }

    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < text.length) {
    tokens.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return tokens.length ? tokens : [{ type: 'text', value: text }];
}

function InlineRichText({ text }: { text: string }) {
  const tokens = tokenizeInline(text);

  return (
    <>
      {tokens.map((token, index) => {
        if (token.type === 'bold') {
          return (
            <strong key={index} className="font-semibold text-slate-100">
              {token.value}
            </strong>
          );
        }

        if (token.type === 'italic') {
          return (
            <em key={index} className="italic text-slate-300">
              {token.value}
            </em>
          );
        }

        if (token.type === 'code') {
          return (
            <code
              key={index}
              className="rounded-md border border-violet-300/10 bg-violet-400/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-violet-200"
            >
              {token.value}
            </code>
          );
        }

        return <React.Fragment key={index}>{token.value}</React.Fragment>;
      })}
    </>
  );
}

type ParsedBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bullet'; text: string }
  | { type: 'number'; number: string; text: string }
  | { type: 'quote'; text: string }
  | { type: 'code'; language?: string; text: string }
  | { type: 'divider' };

function parseProfessionalBlocks(source: string): ParsedBlock[] {
  const text = source.replace(/\r/g, '').trim();
  if (!text) return [];

  const lines = text.split('\n');
  const blocks: ParsedBlock[] = [];
  let paragraph: string[] = [];
  let inCode = false;
  let codeLanguage = '';
  let codeLines: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const value = paragraph.join(' ').trim();
    if (value) blocks.push({ type: 'paragraph', text: value });
    paragraph = [];
  };

  const flushCode = () => {
    blocks.push({
      type: 'code',
      language: codeLanguage || undefined,
      text: codeLines.join('\n'),
    });
    codeLanguage = '';
    codeLines = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      flushParagraph();
      if (!inCode) {
        inCode = true;
        codeLanguage = trimmed.slice(3).trim();
      } else {
        inCode = false;
        flushCode();
      }
      return;
    }

    if (inCode) {
      codeLines.push(rawLine);
      return;
    }

    if (!trimmed) {
      flushParagraph();
      return;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
      return;
    }

    if (/^([-*_])\1\1+$/.test(trimmed)) {
      flushParagraph();
      blocks.push({ type: 'divider' });
      return;
    }

    const bulletMatch = trimmed.match(/^[-*+•]\s+(.+)$/);
    if (bulletMatch) {
      flushParagraph();
      blocks.push({ type: 'bullet', text: bulletMatch[1].trim() });
      return;
    }

    const numberedMatch = trimmed.match(/^(\d+)[.)]\s+(.+)$/);
    if (numberedMatch) {
      flushParagraph();
      blocks.push({
        type: 'number',
        number: numberedMatch[1],
        text: numberedMatch[2].trim(),
      });
      return;
    }

    const quoteMatch = trimmed.match(/^>\s?(.+)$/);
    if (quoteMatch) {
      flushParagraph();
      blocks.push({ type: 'quote', text: quoteMatch[1].trim() });
      return;
    }

    paragraph.push(trimmed);
  });

  flushParagraph();
  if (inCode) flushCode();

  return blocks;
}

function ProfessionalMessage({ text }: { text: string }) {
  const blocks = useMemo(() => parseProfessionalBlocks(text), [text]);

  if (!blocks.length) {
    return <p className="leading-6 text-slate-300">{cleanMarkdownNoise(text)}</p>;
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const compact = block.level >= 4;
          return (
            <div
              key={index}
              className={
                compact
                  ? 'pt-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-violet-300'
                  : 'pt-2 text-[15px] font-semibold leading-6 text-slate-50'
              }
            >
              <InlineRichText text={block.text} />
            </div>
          );
        }

        if (block.type === 'bullet') {
          return (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl border border-white/[0.045] bg-white/[0.025] px-3 py-2.5"
            >
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300 shadow-[0_0_10px_rgba(34,211,238,.45)]" />
              <div className="min-w-0 flex-1 leading-6 text-slate-300">
                <InlineRichText text={block.text} />
              </div>
            </div>
          );
        }

        if (block.type === 'number') {
          return (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl border border-blue-300/[0.07] bg-gradient-to-r from-violet-500/[0.06] to-indigo-400/[0.02] px-3 py-3"
            >
              <div className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-lg border border-violet-300/15 bg-violet-400/[0.08] px-1.5 text-[10px] font-bold text-violet-200">
                {block.number}
              </div>
              <div className="min-w-0 flex-1 leading-6 text-slate-300">
                <InlineRichText text={block.text} />
              </div>
            </div>
          );
        }

        if (block.type === 'quote') {
          return (
            <div
              key={index}
              className="rounded-r-xl border-l-2 border-violet-300/70 bg-violet-400/[0.035] px-4 py-3 italic leading-6 text-slate-400"
            >
              <InlineRichText text={block.text} />
            </div>
          );
        }

        if (block.type === 'code') {
          return (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#090A0E]"
            >
              {block.language && (
                <div className="border-b border-white/[0.06] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">
                  {block.language}
                </div>
              )}
              <pre className="overflow-x-auto px-3 py-3 text-[11px] leading-5 text-slate-300">
                <code>{block.text}</code>
              </pre>
            </div>
          );
        }

        if (block.type === 'divider') {
          return <div key={index} className="my-3 h-px bg-white/[0.06]" />;
        }

        return (
          <p key={index} className="leading-6 text-slate-300">
            <InlineRichText text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

export function KorvenzaAIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions);
  const [memory, setMemory] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(safeParse<ChatMessage[]>(localStorage.getItem(CHAT_KEY), []));
    setMemory(localStorage.getItem(MEMORY_KEY) || '');
    setSuggestions(
      safeParse<string[]>(
        localStorage.getItem(SUGGESTIONS_KEY),
        initialSuggestions,
      ),
    );
  }, []);

  useEffect(() => {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-80)));
  }, [messages]);

  useEffect(() => {
    if (memory) localStorage.setItem(MEMORY_KEY, memory);
    else localStorage.removeItem(MEMORY_KEY);
  }, [memory]);

  useEffect(() => {
    localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(suggestions));
  }, [suggestions]);

  useEffect(() => {
    if (open) {
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }),
        60,
      );
    }
  }, [open, messages, loading]);

  useEffect(() => {
    if (open && !loading) {
      setTimeout(() => textareaRef.current?.focus(), 120);
    }
  }, [open, loading]);

  const hasConversation = messages.length > 0;

  const historyForApi = useMemo(
    () =>
      messages
        .slice(-28)
        .map((message) => ({ role: message.role, text: message.text })),
    [messages],
  );

  const resizeTextarea = () => {
    const element = textareaRef.current;
    if (!element) return;

    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 132)}px`;
  };

  const sendMessage = async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: uid(),
      role: 'user',
      text,
      createdAt: Date.now(),
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput('');
    setSuggestions([]);
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyForApi,
          memory,
          responseStyle: {
            tone: 'professional',
            format: 'clean-markdown',
            mirrorUserLanguage: true,
            avoidRawMarkdownSymbols: true,
            conciseSections: true,
          },
        }),
      });

      const data = (await response.json()) as ChatResponse & { error?: string };

      if (!response.ok) {
        throw new Error(
          data.error || 'The AI assistant is temporarily unavailable.',
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          id: uid(),
          role: 'assistant',
          text:
            data.reply ||
            'I’m here. Tell me what you would like to build or improve.',
          createdAt: Date.now(),
        },
      ]);

      if (Array.isArray(data.suggestions) && data.suggestions.length) {
        setSuggestions(data.suggestions.slice(0, 3));
      }

      if (typeof data.memory === 'string') {
        setMemory(data.memory.slice(0, 5000));
      }
    } catch (error: any) {
      setMessages((previous) => [
        ...previous,
        {
          id: uid(),
          role: 'assistant',
          text: `I couldn't reach the AI service right now. ${
            error?.message || 'Please try again in a moment.'
          }`,
          createdAt: Date.now(),
        },
      ]);

      setSuggestions([
        'Try again',
        'Tell me about KorvenzaTech services',
        'Help me plan my project',
      ]);
    } finally {
      setLoading(false);
    }
  };

  const newChat = () => {
    setMessages([]);
    setSuggestions(initialSuggestions);
    setInput('');
    setMenuOpen(false);
  };

  const clearMemory = () => {
    setMessages([]);
    setMemory('');
    setSuggestions(initialSuggestions);
    setInput('');
    setMenuOpen(false);

    localStorage.removeItem(CHAT_KEY);
    localStorage.removeItem(MEMORY_KEY);
    localStorage.removeItem(SUGGESTIONS_KEY);
  };

  const copyMessage = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(cleanMarkdownNoise(text));
      setCopied(id);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      // Clipboard may be unavailable in some browsers.
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Korvenza AI assistant"
          className="korvenza-ai-launcher group"
        >
          <span className="korvenza-ai-launcher-glow" />
          <img
            src="/korvenza-logo.png"
            alt=""
            className="relative z-10 h-8 w-8 object-contain"
          />
          <span className="relative z-10 hidden text-sm font-bold tracking-tight sm:block">
            Ask Korvenza AI
          </span>
          <span className="absolute -right-1 -top-1 z-20 h-3 w-3 rounded-full border-2 border-[#08090B] bg-emerald-400" />
        </button>
      )}

      {open && (
        <div
          className="korvenza-ai-shell"
          role="dialog"
          aria-label="Korvenza AI assistant"
        >
          <div className="korvenza-ai-header">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-[#12131A] shadow-[0_0_28px_rgba(34,211,238,.08)]">
                <img
                  src="/korvenza-logo.png"
                  alt="KorvenzaTech"
                  className="h-8 w-8 object-contain"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0D0E13] bg-emerald-400" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-sm font-bold text-slate-50">
                    Korvenza AI
                  </h2>
                  {/* <span className="rounded-md border border-violet-300/10 bg-violet-400/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[.14em] text-violet-200">
                    Korvenza AI
                  </span> */}
                </div>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Multilingual • Professional • Conversation memory
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={newChat}
                title="New chat"
                className="korvenza-ai-icon-btn"
              >
                <Plus className="h-4 w-4" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen((value) => !value)}
                  title="Chat options"
                  className="korvenza-ai-icon-btn"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-10 z-[1002] w-52 rounded-xl border border-white/10 bg-[#111218] p-1.5 shadow-2xl">
                    <button
                      onClick={newChat}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs text-slate-300 hover:bg-white/5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      New conversation
                    </button>

                    <button
                      onClick={clearMemory}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs text-rose-300 hover:bg-rose-400/5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Clear chat & memory
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setOpen(false)}
                aria-label="Close AI assistant"
                className="korvenza-ai-icon-btn"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="korvenza-ai-body">
            {!hasConversation && (
              <div className="px-5 pb-4 pt-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-300/10 bg-gradient-to-br from-blue-500/15 to-violet-400/5">
                  <Sparkles className="h-5 w-5 text-violet-300" />
                </div>

                <h3 className="text-[22px] font-extrabold leading-tight tracking-tight text-slate-50">
                  What can I help you build?
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                  Explain your idea naturally. I can help with AI, apps, APIs,
                  websites, SaaS, cloud systems, custom software and KorvenzaTech services —
                  in the language you use. For unrelated topics, I’ll keep the
                  conversation focused on how KorvenzaTech can help.
                </p>

                <div className="mt-6 grid gap-2">
                  {initialSuggestions.map((item) => (
                    <button
                      key={item}
                      onClick={() => sendMessage(item)}
                      className="korvenza-ai-starter"
                    >
                      <span>{item}</span>
                      <ArrowUp className="h-3.5 w-3.5 rotate-45" />
                    </button>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2 text-[10px] text-slate-600">
                  <Bot className="h-3.5 w-3.5" />
                  Securely operated by KorvenzaTech
                </div>
              </div>
            )}

            {hasConversation && (
              <div className="space-y-5 px-4 py-5 sm:px-5">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.role === 'user'
                        ? 'flex justify-end'
                        : 'flex justify-start'
                    }
                  >
                    {message.role === 'user' ? (
                      <div className="max-w-[84%] whitespace-pre-wrap rounded-2xl rounded-br-md border border-blue-400/10 bg-[#24213D] px-4 py-3 text-[13px] leading-6 text-slate-100 shadow-sm">
                        {message.text}
                      </div>
                    ) : (
                      <div className="group w-full">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-violet-300/10 bg-[#14151C]">
                            <img
                              src="/korvenza-logo.png"
                              alt=""
                              className="h-5 w-5 object-contain"
                            />
                          </div>

                          <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-white/[0.055] bg-white/[0.025] px-4 py-3.5 text-[13px] text-slate-300 shadow-sm">
                            <ProfessionalMessage text={message.text} />

                            <button
                              onClick={() =>
                                copyMessage(message.id, message.text)
                              }
                              className="mt-3 inline-flex items-center gap-1.5 text-[10px] text-slate-600 transition-colors hover:text-slate-300"
                            >
                              {copied === message.id ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                              {copied === message.id ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-300/10 bg-[#14151C]">
                      <img
                        src="/korvenza-logo.png"
                        alt=""
                        className="h-5 w-5 object-contain"
                      />
                    </div>

                    <div className="py-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Korvenza AI is thinking
                      </div>
                      <div className="mt-2 flex gap-1">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-300/50" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-300/35 [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-300/20 [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}

                {!loading && suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1 pl-10">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => sendMessage(suggestion)}
                        className="korvenza-ai-suggestion"
                      >
                        {suggestion}
                        <ArrowUp className="h-3 w-3 shrink-0 rotate-45" />
                      </button>
                    ))}
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            )}
          </div>

          <div className="korvenza-ai-composer-wrap">
            <div className="korvenza-ai-composer">
              <textarea
                ref={textareaRef}
                value={input}
                rows={1}
                maxLength={4000}
                disabled={loading}
                onChange={(event) => {
                  setInput(event.target.value);
                  requestAnimationFrame(resizeTextarea);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Message Korvenza AI…"
                className="min-h-[24px] max-h-[132px] flex-1 resize-none bg-transparent py-1 text-[13px] leading-5 text-slate-100 outline-none placeholder:text-slate-600"
              />

              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-950 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="mt-2 flex justify-between gap-4 px-1 text-[9px] text-slate-600">
              <span>AI can make mistakes. Verify important information.</span>
              {memory && (
                <span className="whitespace-nowrap text-violet-500/70">
                  Memory on
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
