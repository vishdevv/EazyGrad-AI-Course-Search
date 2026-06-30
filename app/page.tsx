"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroSearch from "@/components/HeroSearch";
import ProgramCard from "@/components/ProgramCard";
import FilterSidebar from "@/components/FilterSidebar";
import {
  LoadingState,
  ErrorState,
  EmptySearchState,
  EmptyFilterState,
} from "@/components/SearchStates";
import { filterMatches } from "@/lib/filters";
import type { SearchResponse, FilterState } from "@/types";

type PageState =
  | { stage: "idle" }
  | { stage: "loading" }
  | { stage: "error"; message: string }
  | { stage: "results"; data: SearchResponse };

const DEFAULT_FILTERS: FilterState = {
  degreeTypes: [],
  feeRange: null,
  durationRange: null,
  providers: [],
};

export default function HomePage() {
  const [pageState, setPageState] = useState<PageState>({ stage: "idle" });
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  // hasSearched: flips true on first successful result — triggers compact layout
  const [hasSearched, setHasSearched] = useState(false);

  const handleResults = useCallback((data: SearchResponse) => {
    setHasSearched(true);
    setFilters(DEFAULT_FILTERS);
    setPageState({ stage: "results", data });
  }, []);

  const handleError = useCallback((message: string) => {
    setPageState({ stage: "error", message });
  }, []);

  const handleLoadingChange = useCallback((loading: boolean) => {
    if (loading) setPageState({ stage: "loading" });
  }, []);

  const handleRetry = useCallback(() => {
    setHasSearched(false);
    setPageState({ stage: "idle" });
  }, []);

  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageState.stage === "error") {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [pageState.stage]);

  const isLoading = pageState.stage === "loading";

  const allMatches =
    pageState.stage === "results" ? pageState.data.matches : [];

  const visibleMatches = filterMatches(allMatches, filters);

  const searchProps = {
    onResults: handleResults,
    onError: handleError,
    onLoadingChange: handleLoadingChange,
    isLoading,
  };

  /* ── Compact layout — shown after first successful search ── */
  if (hasSearched) {
    return (
      <div className="min-h-screen flex flex-col bg-bg">
        {/* Thin header: logo + compact search */}
        <header className="shrink-0 border-b border-border bg-surface sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 sm:gap-5">
            <Link href="/" onClick={handleRetry} className="shrink-0">
              <Image
                src="/eazygrad-logo.png"
                alt="EazyGrad"
                width={110}
                height={23}
                className="h-5 sm:h-6 w-auto"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <HeroSearch compact {...searchProps} />
            </div>
            <Link
              href="/explore"
              className="shrink-0 text-sm text-teal font-semibold hover:underline underline-offset-2 whitespace-nowrap hidden sm:block"
            >
              Browse all
            </Link>
          </div>
        </header>

        <main className="flex-1">
          {pageState.stage === "loading" && <LoadingState />}

          {pageState.stage === "error" && (
            <div ref={errorRef} className="max-w-5xl mx-auto px-6 sm:px-8">
              <ErrorState message={pageState.message} onRetry={handleRetry} />
            </div>
          )}

          {pageState.stage === "results" && (
            <section className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
              {allMatches.length === 0 ? (
                <EmptySearchState
                  reason={pageState.stage === "results" ? pageState.data.noMatchReason : undefined}
                  message={pageState.stage === "results" ? pageState.data.noMatchMessage : undefined}
                />
              ) : (
                <div className="flex flex-col lg:flex-row gap-10">
                  {/* Sidebar */}
                  <div className="shrink-0 lg:w-72 lg:border-r lg:border-border lg:pr-8">
                    <div className="lg:sticky lg:top-8">
                      <FilterSidebar
                        filters={filters}
                        onChange={setFilters}
                        allMatches={allMatches}
                        visibleCount={visibleMatches.length}
                      />
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 min-w-0">
                    {visibleMatches.length === 0 ? (
                      <EmptyFilterState
                        onClear={() => setFilters(DEFAULT_FILTERS)}
                      />
                    ) : (
                      <div className="flex flex-col gap-3">
                        {visibleMatches.map((match, i) => (
                          <ProgramCard
                            key={match.program._id}
                            match={match}
                            rank={i + 1}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    );
  }

  /* ── Full hero layout — shown before first search ── */
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <main className="flex flex-1 flex-col justify-center">
        <HeroSearch {...searchProps} />

        {pageState.stage === "loading" && <LoadingState />}

        {pageState.stage === "error" && (
          <div ref={errorRef} className="max-w-xl mx-auto w-full px-4 pb-16">
            <ErrorState message={pageState.message} onRetry={handleRetry} />
          </div>
        )}
      </main>
    </div>
  );
}
