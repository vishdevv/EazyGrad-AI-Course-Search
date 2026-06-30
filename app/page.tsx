"use client";

import { useState, useCallback } from "react";
import HeroSearch from "@/components/HeroSearch";
import ProgramCard from "@/components/ProgramCard";
import FilterSidebar from "@/components/FilterSidebar";
import {
  LoadingState,
  ErrorState,
  EmptySearchState,
  EmptyFilterState,
} from "@/components/SearchStates";
import type { SearchResponse, MatchResult, FilterState } from "@/types";

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

function applyFilters(matches: MatchResult[], filters: FilterState): MatchResult[] {
  return matches.filter(({ program }) => {
    if (
      filters.degreeTypes.length > 0 &&
      !filters.degreeTypes.includes(program.degreeType)
    ) {
      return false;
    }

    if (filters.feeRange) {
      const { min, max } = filters.feeRange;
      // Include if fee range overlaps — fee band isn't strictly under/over
      if (program.feeMax < min || program.feeMin > max) return false;
    }

    if (filters.durationRange) {
      const { minMonths, maxMonths } = filters.durationRange;
      if (program.durationMonths < minMonths || program.durationMonths > maxMonths) {
        return false;
      }
    }

    if (
      filters.providers.length > 0 &&
      !filters.providers.includes(program.provider)
    ) {
      return false;
    }

    return true;
  });
}

export default function HomePage() {
  const [pageState, setPageState] = useState<PageState>({ stage: "idle" });
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const handleResults = useCallback((data: SearchResponse) => {
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
    setPageState({ stage: "idle" });
  }, []);

  const isLoading = pageState.stage === "loading";

  const allMatches =
    pageState.stage === "results" ? pageState.data.matches : [];

  const visibleMatches = applyFilters(allMatches, filters);

  return (
    <main className="flex flex-1 flex-col min-h-screen">
      {/* Hero — always visible, shrinks once results are shown */}
      <div
        className={
          pageState.stage === "idle" || pageState.stage === "loading"
            ? "flex flex-1 flex-col justify-center"
            : ""
        }
      >
        <HeroSearch
          onResults={handleResults}
          onError={handleError}
          onLoadingChange={handleLoadingChange}
          isLoading={isLoading}
        />
      </div>

      {/* Results area */}
      {pageState.stage === "loading" && <LoadingState />}

      {pageState.stage === "error" && (
        <div className="max-w-2xl mx-auto w-full px-4">
          <ErrorState message={pageState.message} onRetry={handleRetry} />
        </div>
      )}

      {pageState.stage === "results" && (
        <section className="flex-1 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {allMatches.length === 0 ? (
              <EmptySearchState />
            ) : (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="lg:w-56 xl:w-64 shrink-0">
                  <div className="lg:sticky lg:top-8">
                    <FilterSidebar
                      filters={filters}
                      onChange={setFilters}
                      allMatches={allMatches}
                      visibleCount={visibleMatches.length}
                    />
                  </div>
                </div>

                {/* Cards grid */}
                <div className="flex-1 min-w-0">
                  {visibleMatches.length === 0 ? (
                    <EmptyFilterState
                      onClear={() => setFilters(DEFAULT_FILTERS)}
                    />
                  ) : (
                    <div className="flex flex-col gap-4">
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
          </div>
        </section>
      )}
    </main>
  );
}
