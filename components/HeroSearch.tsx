"use client";

import React, { useState, useEffect, useRef } from "react";
import type { SearchResponse, SearchErrorResponse } from "@/types";

interface HeroSearchProps {
  onResults: (data: SearchResponse) => void;
  onError: (message: string) => void;
  onLoadingChange: (loading: boolean) => void;
  isLoading: boolean;
}

const PLACEHOLDER_CYCLE = [
  "I'm a working professional with a commerce background, want to grow into management…",
  "Fresh graduate, interested in AI and machine learning, no CS degree…",
  "10 years in IT support, want a formal degree that opens senior roles…",
  "BCom done, want to specialise in taxation and accounting…",
  "Engineer switching careers into product management or business analytics…",
];

export default function HeroSearch({
  onResults,
  onError,
  onLoadingChange,
  isLoading,
}: HeroSearchProps) {
  const [query, setQuery] = useState("");
  // Start at 0 (matches SSR), randomise after mount to avoid hydration mismatch
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setPlaceholderIndex(Math.floor(Math.random() * PLACEHOLDER_CYCLE.length));
  }, []);

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
        const err = data as SearchErrorResponse;
        onError(err.error ?? "Something went wrong. Please try again.");
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

  return (
    <section className="flex flex-col items-center justify-center px-4 py-20 sm:py-32 text-center">
      {/* Wordmark */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <span className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase">
          EazyGrad
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-tight max-w-2xl">
          Find your degree.{" "}
          <span className="text-blue-600">Describe your goals.</span>
        </h1>
        <p className="mt-2 text-lg text-gray-500 max-w-xl">
          Tell us about your background and where you want to go — our AI
          matches you to the right online program.
        </p>
      </div>

      {/* Search form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl"
        aria-label="Program search"
      >
        <div className="relative rounded-xl border border-gray-200 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-shadow">
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={PLACEHOLDER_CYCLE[placeholderIndex]}
            rows={3}
            disabled={isLoading}
            aria-label="Describe your background and goals"
            className="w-full resize-none rounded-xl bg-transparent px-5 pt-4 pb-14 text-base text-gray-900 placeholder-gray-400 focus:outline-none disabled:opacity-60"
          />

          {/* Submit bar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              {query.trim().length > 0
                ? `${query.trim().length} chars · Enter to search`
                : "Shift+Enter for new line · Enter to search"}
            </span>
            <button
              type="submit"
              disabled={query.trim().length < 5 || isLoading}
              aria-label="Search for matching programs"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Matching…
                </>
              ) : (
                <>
                  <SearchIcon />
                  Find programs
                </>
              )}
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-400">
          Press Enter to search. Try describing your education, work background,
          or the role you&apos;re aiming for.
        </p>
      </form>
    </section>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
        clipRule="evenodd"
      />
    </svg>
  );
}
