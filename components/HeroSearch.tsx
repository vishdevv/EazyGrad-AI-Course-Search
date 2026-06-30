"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef } from "react";
import type { SearchResponse, SearchErrorResponse } from "@/types";

interface HeroSearchProps {
  onResults: (data: SearchResponse) => void;
  onError: (message: string) => void;
  onLoadingChange: (loading: boolean) => void;
  isLoading: boolean;
  compact?: boolean;
}

const PLACEHOLDER =
  "e.g. Working in commerce for 4 years, aiming for a management role without leaving my job.";

export default function HeroSearch({
  onResults,
  onError,
  onLoadingChange,
  isLoading,
  compact = false,
}: HeroSearchProps) {
  const [query, setQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e?: { preventDefault(): void }) {
    e?.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 5 || isLoading) return;
    onLoadingChange(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      const data: SearchResponse | SearchErrorResponse = await res.json();
      if (!res.ok) {
        onError((data as SearchErrorResponse).error ?? "Something went wrong.");
        return;
      }
      onResults(data as SearchResponse);
    } catch {
      onError("Network error. Check your connection and try again.");
    } finally {
      onLoadingChange(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  const canSubmit = query.trim().length >= 5 && !isLoading;

  /* ── Compact strip — used in the results header ── */
  if (compact) {
    return (
      <form onSubmit={handleSubmit} aria-label="Refine your search">
        <div className="flex items-center gap-2 sm:gap-3 rounded-lg border border-border bg-surface px-3 sm:px-4 py-2.5 focus-within:border-teal focus-within:shadow-[0_0_0_3px_rgba(28,77,69,0.10)] transition-all duration-200">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search again…"
            aria-label="Search again"
            disabled={isLoading}
            className="flex-1 min-w-0 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            aria-label="Search"
            className="shrink-0 h-7 px-3 rounded-md bg-lime text-ink text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {isLoading ? "…" : "Find →"}
          </button>
        </div>
      </form>
    );
  }

  /* ── Full hero ── */
  return (
    <section
      className="flex flex-col items-center justify-center px-4 py-16 sm:py-24"
      aria-label="Program search"
    >
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image
            src="/eazygrad-logo.png"
            alt="EazyGrad"
            width={140}
            height={29}
            priority
            className="h-7 w-auto"
          />
        </div>

        {/* Headline + brushstroke */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-[36px] font-extrabold text-ink leading-tight tracking-tight">
            Degrees matched to
            <br />
            your career goals.
          </h1>

          {/* EazyGrad's actual brushstroke — sits flush under the headline */}
          <div className="flex justify-center mt-2 mb-4">
            <Image
              src="/brushstroke.webp"
              alt=""
              aria-hidden="true"
              width={320}
              height={26}
              className="w-64 sm:w-80 h-auto"
            />
          </div>

          <p className="text-base text-muted leading-relaxed">
            Tell us where you&apos;re headed — we&apos;ll find programs worth
            your time and money.
          </p>
        </div>

        {/* Search input */}
        <form onSubmit={handleSubmit}>
          <div className="relative rounded-xl border border-border bg-surface focus-within:border-teal focus-within:shadow-[0_0_0_3px_rgba(28,77,69,0.10)] transition-all duration-200 shadow-sm">
            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              placeholder={PLACEHOLDER}
              rows={4}
              disabled={isLoading}
              aria-label="Describe your background and goals"
              className="w-full resize-none rounded-xl bg-transparent px-5 pt-5 pb-16 text-[15px] leading-relaxed text-ink placeholder:text-muted focus:outline-none disabled:opacity-60"
            />
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3.5">
              <span className="font-mono text-[11px] text-muted">
                {query.trim().length > 0
                  ? `${query.trim().length} chars · Shift+Enter for new line`
                  : "Shift+Enter for new line · Enter to search"}
              </span>
              <button
                type="submit"
                disabled={!canSubmit}
                className="h-8 px-4 rounded-lg bg-lime text-ink text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                {isLoading ? "Matching…" : "Find programs →"}
              </button>
            </div>
          </div>
        </form>

        <p className="mt-3 text-center font-mono text-[11px] text-muted">
          Describe your education, experience, or the role you&apos;re aiming for.
        </p>

        <p className="mt-4 text-center text-sm text-muted">
          Not sure what to search?{" "}
          <Link
            href="/explore"
            className="text-teal font-semibold hover:underline underline-offset-2"
          >
            Browse all programs →
          </Link>
        </p>
      </div>
    </section>
  );
}
