"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import ProgramCard from "@/components/ProgramCard";
import FilterSidebar from "@/components/FilterSidebar";
import { filterPrograms } from "@/lib/filters";
import type { Program, MatchResult, FilterState } from "@/types";

const DEFAULT_FILTERS: FilterState = {
  degreeTypes: [],
  feeRange: null,
  durationRange: null,
  providers: [],
};

function programsAsMatches(programs: Program[]): MatchResult[] {
  return programs.map((p) => ({ program: p, reasoning: "", relevanceScore: 0 }));
}

export default function ExplorePage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/programs")
      .then(async (r) => {
        if (!r.ok) throw new Error("Request failed");
        const data: unknown = await r.json();
        if (!Array.isArray(data)) throw new Error("Unexpected response shape");
        setPrograms(data as Program[]);
      })
      .catch(() => setError("Could not load programs. Is the database connected?"))
      .finally(() => setLoading(false));
  }, []);

  const handleFiltersChange = useCallback((next: FilterState) => {
    setFilters(next);
  }, []);

  const visible = filterPrograms(programs, filters);
  const allAsMatches = programsAsMatches(programs);
  const visibleAsMatches = programsAsMatches(visible);

  const providerCount = new Set(programs.map((p) => p.provider)).size;
  const degreeTypeCount = new Set(programs.map((p) => p.degreeType)).size;

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Header */}
      <header className="shrink-0 bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="shrink-0">
            <Image
              src="/eazygrad-logo.png"
              alt="EazyGrad"
              width={110}
              height={23}
              className="h-5 sm:h-6 w-auto"
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg bg-lime text-ink text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            ✦ AI Search
          </Link>
        </div>
      </header>

      {/* Stats hero — teal band */}
      <div className="bg-teal text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-xs font-bold uppercase tracking-widest text-lime mb-2">
            Full Program Catalog
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-1">
            Every program, all in one place.
          </h1>
          <p className="text-sm text-white/70 mb-8">
            Browse and filter the complete catalog — or use AI Search to get programs matched to your specific goals.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 sm:gap-12">
            {loading ? (
              <div className="h-10 w-48 bg-white/10 rounded animate-pulse" />
            ) : (
              <>
                <div>
                  <p className="text-4xl font-extrabold text-lime leading-none">{programs.length}</p>
                  <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">Programs</p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-lime leading-none">{providerCount}</p>
                  <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">Universities</p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-lime leading-none">{degreeTypeCount}</p>
                  <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">Degree Types</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {error && (
            <p className="text-sm text-muted py-12">{error}</p>
          )}

          {loading && !error && (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface rounded-2xl border border-border h-40 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && !error && programs.length > 0 && (
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
              {/* Sidebar */}
              <div className="w-full lg:w-72 lg:shrink-0">
                <div className="lg:sticky lg:top-[61px]">
                  <FilterSidebar
                    filters={filters}
                    onChange={handleFiltersChange}
                    allMatches={allAsMatches}
                    visibleCount={visible.length}
                    countLabel="programs"
                  />
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 min-w-0">
                {visible.length === 0 ? (
                  <div className="py-12">
                    <p className="font-bold text-ink mb-2">No programs match these filters.</p>
                    <button
                      onClick={() => setFilters(DEFAULT_FILTERS)}
                      className="h-8 px-4 rounded-lg bg-lime text-ink text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:gap-4">
                    {visibleAsMatches.map((match, i) => (
                      <ProgramCard
                        key={match.program._id}
                        match={match}
                        rank={i + 1}
                        showReasoning={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
