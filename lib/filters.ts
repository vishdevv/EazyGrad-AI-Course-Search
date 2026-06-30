import type { Program, MatchResult, FilterState } from "@/types";

export function programMatchesFilters(program: Program, filters: FilterState): boolean {
  if (
    filters.degreeTypes.length > 0 &&
    !filters.degreeTypes.includes(program.degreeType)
  ) {
    return false;
  }

  if (filters.feeRange) {
    const { min, max } = filters.feeRange;
    // Overlap check — include programs whose fee band intersects the filter range
    if (program.feeMax < min || program.feeMin > max) return false;
  }

  if (filters.durationRange) {
    const { minMonths, maxMonths } = filters.durationRange;
    // Half-open interval [minMonths, maxMonths) so adjacent buckets don't overlap
    if (program.durationMonths < minMonths || program.durationMonths >= maxMonths) {
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
}

export function filterPrograms(programs: Program[], filters: FilterState): Program[] {
  return programs.filter((program) => programMatchesFilters(program, filters));
}

export function filterMatches(matches: MatchResult[], filters: FilterState): MatchResult[] {
  return matches.filter(({ program }) => programMatchesFilters(program, filters));
}
