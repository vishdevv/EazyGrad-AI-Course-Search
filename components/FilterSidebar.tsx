"use client";

import type {
  FilterState,
  DegreeType,
  FeeRangeOption,
  DurationRangeOption,
  MatchResult,
} from "@/types";
import { DEGREE_TYPES, FEE_RANGES, DURATION_RANGES } from "@/types";

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  allMatches: MatchResult[];
  visibleCount: number;
  countLabel?: string;
}

export default function FilterSidebar({
  filters,
  onChange,
  allMatches,
  visibleCount,
  countLabel = "matches",
}: FilterSidebarProps) {
  const providers = [
    ...new Set(allMatches.map((m) => m.program.provider)),
  ].sort();

  const activeDegreeTypes = [
    ...new Set(allMatches.map((m) => m.program.degreeType)),
  ] as DegreeType[];

  function toggleDegreeType(dt: DegreeType) {
    const next = filters.degreeTypes.includes(dt)
      ? filters.degreeTypes.filter((d) => d !== dt)
      : [...filters.degreeTypes, dt];
    onChange({ ...filters, degreeTypes: next });
  }

  function toggleProvider(provider: string) {
    const next = filters.providers.includes(provider)
      ? filters.providers.filter((p) => p !== provider)
      : [...filters.providers, provider];
    onChange({ ...filters, providers: next });
  }

  function setFeeRange(range: FeeRangeOption) {
    onChange({
      ...filters,
      feeRange: filters.feeRange?.label === range.label ? null : range,
    });
  }

  function setDurationRange(range: DurationRangeOption) {
    onChange({
      ...filters,
      durationRange:
        filters.durationRange?.label === range.label ? null : range,
    });
  }

  function clearAll() {
    onChange({ degreeTypes: [], feeRange: null, durationRange: null, providers: [] });
  }

  const hasActiveFilters =
    filters.degreeTypes.length > 0 ||
    filters.feeRange !== null ||
    filters.durationRange !== null ||
    filters.providers.length > 0;

  return (
    <aside aria-label="Filter results">
      {/* Match count card */}
      <div className="bg-surface rounded-2xl border border-border px-4 py-4 mb-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-teal mb-1">
          Results
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-teal leading-none">
            {visibleCount}
          </span>
          <span className="text-sm text-muted">/ {allMatches.length} {countLabel}</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="mt-3 w-full h-7 rounded-lg bg-[#F5FBE8] border border-[#DFF0BC] text-[11px] font-semibold text-teal hover:bg-[#DFF0BC] transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Filter sections */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        {activeDegreeTypes.length > 0 && (
          <FilterSection title="Degree">
            {DEGREE_TYPES.filter((dt) => activeDegreeTypes.includes(dt)).map((dt) => (
              <CheckItem
                key={dt}
                type="checkbox"
                name="degree-type"
                label={dt}
                checked={filters.degreeTypes.includes(dt)}
                onChange={() => toggleDegreeType(dt)}
              />
            ))}
          </FilterSection>
        )}

        <FilterSection title="Fee range">
          {FEE_RANGES.map((range) => (
            <CheckItem
              key={range.label}
              type="radio"
              name="fee-range"
              label={range.label}
              checked={filters.feeRange?.label === range.label}
              onChange={() => setFeeRange(range)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Duration">
          {DURATION_RANGES.map((range) => (
            <CheckItem
              key={range.label}
              type="radio"
              name="duration-range"
              label={range.label}
              checked={filters.durationRange?.label === range.label}
              onChange={() => setDurationRange(range)}
            />
          ))}
        </FilterSection>

        {providers.length > 1 && (
          <FilterSection title="Provider" last>
            {providers.map((p) => (
              <CheckItem
                key={p}
                type="checkbox"
                name="provider"
                label={p}
                checked={filters.providers.includes(p)}
                onChange={() => toggleProvider(p)}
              />
            ))}
          </FilterSection>
        )}
      </div>
    </aside>
  );
}

function FilterSection({
  title,
  children,
  last = false,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`px-4 py-4 ${last ? "" : "border-b border-border"}`}>
      <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-teal mb-3">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-lime" />
        {title}
      </h3>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

interface CheckItemProps {
  type: "checkbox" | "radio";
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

function CheckItem({ type, name, label, checked, onChange }: CheckItemProps) {
  return (
    <label
      className={`flex items-center gap-2.5 cursor-pointer rounded-lg px-2 py-1.5 transition-colors ${
        checked ? "bg-[#F5FBE8]" : "hover:bg-bg"
      }`}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-3.5 w-3.5 accent-teal cursor-pointer shrink-0"
      />
      <span
        className={`text-sm leading-tight transition-colors ${
          checked ? "text-teal font-semibold" : "text-muted"
        }`}
      >
        {label}
      </span>
    </label>
  );
}
