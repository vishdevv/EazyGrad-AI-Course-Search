// ─── Degree & Program ───────────────────────────────────────────────────────

export const DEGREE_TYPES = [
  "MBA",
  "BBA",
  "MCA",
  "BCA",
  "MScIT",
  "BScCS",
  "MCom",
  "BCom",
] as const;

export type DegreeType = (typeof DEGREE_TYPES)[number];

export interface Program {
  _id: string;
  name: string;
  provider: string;
  degreeType: DegreeType;
  specialization: string;
  durationMonths: number;
  feeMin: number; // INR
  feeMax: number; // INR
  description: string;
  eligibility: string;
  mode: "online" | "hybrid";
  tags: string[];
}

// ─── Search API ──────────────────────────────────────────────────────────────

export interface SearchQuery {
  query: string;
}

export interface MatchResult {
  program: Program;
  reasoning: string; // one-line explanation from the LLM
  relevanceScore: number; // 1–10, used for ordering display
}

export type NoMatchReason = "catalog_gap" | "off_topic" | "vague";

export interface SearchResponse {
  matches: MatchResult[];
  totalMatches: number;
  noMatchReason?: NoMatchReason;
  noMatchMessage?: string;
}

export interface SearchErrorResponse {
  error: string;
  code: "EMPTY_QUERY" | "NO_MATCHES" | "AI_ERROR" | "RATE_LIMIT" | "DB_ERROR";
}

// ─── Filters (client-side) ───────────────────────────────────────────────────

export interface FeeRangeOption {
  label: string;
  min: number;
  max: number;
}

export interface DurationRangeOption {
  label: string;
  minMonths: number;
  maxMonths: number;
}

export interface FilterState {
  degreeTypes: DegreeType[];
  feeRange: FeeRangeOption | null;
  durationRange: DurationRangeOption | null;
  providers: string[];
}

// ─── Filter constants ─────────────────────────────────────────────────────────

export const FEE_RANGES: FeeRangeOption[] = [
  { label: "Under ₹1L", min: 0, max: 100_000 },
  { label: "₹1L – ₹2L", min: 100_000, max: 200_000 },
  { label: "₹2L – ₹4L", min: 200_000, max: 400_000 },
  { label: "Above ₹4L", min: 400_000, max: Number.MAX_SAFE_INTEGER },
];

export const DURATION_RANGES: DurationRangeOption[] = [
  { label: "Under 1 year", minMonths: 0, maxMonths: 12 },
  { label: "1 – 2 years", minMonths: 12, maxMonths: 24 },
  { label: "2+ years", minMonths: 24, maxMonths: Number.MAX_SAFE_INTEGER },
];

// ─── Internal AI types (used in /lib only) ───────────────────────────────────

export interface AIMatchItem {
  programId: string;
  reasoning: string;
  relevanceScore: number;
}

export interface AISearchResponse {
  matches: AIMatchItem[];
  noMatchReason?: NoMatchReason;
  noMatchMessage?: string;
}
