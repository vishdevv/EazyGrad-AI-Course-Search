"use client";

import { useState, useEffect } from "react";

/* ── Loading ──────────────────────────────────────────────────────────────── */

const LOADING_PHRASES = [
  "Reading your background…",
  "Scanning the catalog…",
  "Weighing program fit…",
  "Ranking matches…",
];

export function LoadingState() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setPhraseIndex((i) => (i + 1) % LOADING_PHRASES.length),
      1400
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center py-24 gap-5"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Breathing dots in teal */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-2 w-2 rounded-full bg-teal animate-breathe"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>

      {/* Cycling phrase */}
      <p
        key={phraseIndex}
        className="animate-phrase-in font-display text-base font-semibold text-ink"
      >
        {LOADING_PHRASES[phraseIndex]}
      </p>
    </div>
  );
}

/* ── Error ────────────────────────────────────────────────────────────────── */

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-start gap-3 py-12"
      role="alert"
      aria-live="assertive"
    >
      <p className="text-sm font-bold text-ink">Something went wrong.</p>
      <p className="text-sm text-muted max-w-sm leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 h-8 px-4 rounded-lg bg-lime text-ink text-sm font-bold hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      )}
    </div>
  );
}

/* ── Empty — no AI matches ────────────────────────────────────────────────── */

interface EmptySearchStateProps {
  reason?: string;
  message?: string;
}

const CATALOG_EXAMPLES = [
  "MBA in Finance — 3 years in banking, want a management role.",
  "MCA online — working professional with a BCA degree.",
  "BCom graduate looking to switch into tech management.",
];

const VAGUE_EXAMPLES = [
  "I have a BCom degree and 3 years in accounting, want to move into finance management.",
  "Working professional, 5 years in IT support, looking for an online MCA or MBA in tech.",
  "Fresh 12th pass, interested in business and entrepreneurship.",
];

function ExampleList({ examples }: { examples: string[] }) {
  return (
    <ul className="flex flex-col gap-2 w-full">
      {examples.map((ex) => (
        <li
          key={ex}
          className="text-[13px] text-muted bg-surface border border-border rounded-xl px-4 py-3 leading-relaxed"
        >
          &ldquo;{ex}&rdquo;
        </li>
      ))}
    </ul>
  );
}

export function EmptySearchState({ reason, message }: EmptySearchStateProps) {
  if (reason === "catalog_gap") {
    return (
      <div
        className="flex flex-col items-start gap-5 py-10 max-w-lg"
        aria-live="polite"
      >
        {/* Callout */}
        <div className="w-full rounded-2xl bg-[#F5FBE8] border border-[#DFF0BC] px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-teal mb-2">
            Not in our catalog
          </p>
          <p className="text-[14px] text-ink leading-relaxed">
            {message ?? "We don't currently offer programs in that area."}
          </p>
        </div>

        {/* Redirect */}
        <div className="w-full">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted mb-3">
            What we do offer
          </p>
          <ExampleList examples={CATALOG_EXAMPLES} />
        </div>
      </div>
    );
  }

  if (reason === "off_topic") {
    return (
      <div
        className="flex flex-col items-start gap-5 py-10 max-w-lg"
        aria-live="polite"
      >
        <div className="w-full rounded-2xl border border-border bg-surface px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-teal mb-2">
            Not an education query
          </p>
          <p className="text-[14px] text-ink leading-relaxed">
            {message ?? "This doesn't look like an education or career query."}
          </p>
        </div>
        <p className="text-[13px] text-muted leading-relaxed">
          Describe your educational background and what career you&apos;re aiming for — we&apos;ll find the right program for you.
        </p>
      </div>
    );
  }

  // "vague" or unknown
  return (
    <div
      className="flex flex-col items-start gap-5 py-10 max-w-lg"
      aria-live="polite"
    >
      <div className="w-full rounded-2xl border border-border bg-surface px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-teal mb-2">
          Need a bit more detail
        </p>
        <p className="text-[14px] text-ink leading-relaxed">
          {message ?? "The more you tell us about your background and goals, the better we can match you."}
        </p>
      </div>
      <div className="w-full">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted mb-3">
          Try something like
        </p>
        <ExampleList examples={VAGUE_EXAMPLES} />
      </div>
    </div>
  );
}

/* ── Empty — filters over-narrowed ───────────────────────────────────────── */

export function EmptyFilterState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-start gap-3 py-12" aria-live="polite">
      <p className="text-sm font-bold text-ink">
        Your filters narrowed results to zero.
      </p>
      <button
        onClick={onClear}
        className="h-8 px-4 rounded-lg bg-lime text-ink text-sm font-bold hover:opacity-90 transition-opacity"
      >
        Clear filters
      </button>
    </div>
  );
}
