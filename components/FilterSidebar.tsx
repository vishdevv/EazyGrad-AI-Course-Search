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
}

export default function FilterSidebar({
  filters,
  onChange,
  allMatches,
  visibleCount,
}: FilterSidebarProps) {
  const providers = [...new Set(allMatches.map((m) => m.program.provider))].sort();

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

  function setFeeRange(range: FeeRangeOption | null) {
    onChange({
      ...filters,
      feeRange: filters.feeRange?.label === range?.label ? null : range,
    });
  }

  function setDurationRange(range: DurationRangeOption | null) {
    onChange({
      ...filters,
      durationRange:
        filters.durationRange?.label === range?.label ? null : range,
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

  // Only show degree types that appear in the current result set
  const activeDegreeTypes = [
    ...new Set(allMatches.map((m) => m.program.degreeType)),
  ] as DegreeType[];

  return (
    <aside className="flex flex-col gap-6" aria-label="Filter results">
      {/* Result count + clear */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          Showing{" "}
          <span className="text-blue-600 font-semibold">{visibleCount}</span>
          {" of "}
          <span className="font-semibold">{allMatches.length}</span> matches
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Degree type */}
      <FilterSection title="Degree type">
        <div className="flex flex-col gap-1.5">
          {DEGREE_TYPES.filter((dt) => activeDegreeTypes.includes(dt)).map((dt) => (
            <CheckboxItem
              key={dt}
              label={dt}
              checked={filters.degreeTypes.includes(dt)}
              onChange={() => toggleDegreeType(dt)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Fee range */}
      <FilterSection title="Fee range">
        <div className="flex flex-col gap-1.5">
          {FEE_RANGES.map((range) => (
            <RadioItem
              key={range.label}
              label={range.label}
              checked={filters.feeRange?.label === range.label}
              onChange={() => setFeeRange(range)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Duration */}
      <FilterSection title="Duration">
        <div className="flex flex-col gap-1.5">
          {DURATION_RANGES.map((range) => (
            <RadioItem
              key={range.label}
              label={range.label}
              checked={filters.durationRange?.label === range.label}
              onChange={() => setDurationRange(range)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Provider */}
      {providers.length > 1 && (
        <FilterSection title="Provider">
          <div className="flex flex-col gap-1.5">
            {providers.map((provider) => (
              <CheckboxItem
                key={provider}
                label={provider}
                checked={filters.providers.includes(provider)}
                onChange={() => toggleProvider(provider)}
              />
            ))}
          </div>
        </FilterSection>
      )}
    </aside>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {title}
      </h3>
      {children}
    </div>
  );
}

function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />
      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
        {label}
      </span>
    </label>
  );
}

function RadioItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />
      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
        {label}
      </span>
    </label>
  );
}
