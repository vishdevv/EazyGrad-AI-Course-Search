import type { MatchResult } from "@/types";

interface ProgramCardProps {
  match: MatchResult;
  rank: number;
  /** false = catalog/browse mode: hides AI reasoning box and relevance chip */
  showReasoning?: boolean;
}

const MODE_LABEL: Record<"online" | "hybrid", string> = {
  online: "Online",
  hybrid: "Hybrid",
};

export default function ProgramCard({ match, rank, showReasoning = true }: ProgramCardProps) {
  const { program, reasoning, relevanceScore } = match;
  const durationLabel = formatDuration(program.durationMonths);
  const feeLabel = formatFeeRange(program.feeMin, program.feeMax);

  return (
    <article
      className="animate-card-enter bg-surface rounded-2xl border border-border px-5 py-5 sm:px-6 hover:shadow-lg hover:border-teal transition-all duration-200"
      style={{ animationDelay: `${(rank - 1) * 60}ms` }}
      aria-label={`${program.name} from ${program.provider}`}
    >
      {/* ── Header row ── */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Degree badge — light teal pill */}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#E3F0EB] text-teal text-[10px] font-bold uppercase tracking-wider">
              {program.degreeType}
            </span>
            <span className="text-xs text-muted truncate">{program.provider}</span>
          </div>
          <h2 className="font-display text-[16px] sm:text-[17px] font-bold text-ink leading-snug">
            {program.name}
          </h2>
          {program.specialization && (
            <p className="text-[12px] text-muted mt-0.5">{program.specialization}</p>
          )}
        </div>

        {/* Relevance score — only in AI search mode */}
        {showReasoning && (
          <div
            className="shrink-0 flex flex-col items-center justify-center rounded-xl bg-lime px-3 py-1.5 min-w-[52px]"
            aria-label={`Match score ${relevanceScore} out of 10`}
          >
            <span className="font-mono text-[13px] font-bold text-ink leading-none">
              {relevanceScore}/10
            </span>
            <span className="text-[9px] font-semibold text-ink/70 uppercase tracking-wide mt-0.5">
              match
            </span>
          </div>
        )}
      </div>

      {/* ── AI reasoning (search mode) or description (browse mode) ── */}
      {showReasoning ? (
        <div className="rounded-xl bg-[#F5FBE8] border border-[#DFF0BC] px-4 py-3 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-teal mb-1.5">
            ✦ Why this matches
          </p>
          <p className="text-[13px] sm:text-[14px] text-ink leading-relaxed">
            {reasoning}
          </p>
        </div>
      ) : program.description ? (
        <p className="text-[13px] text-muted leading-relaxed mb-4">
          {program.description}
        </p>
      ) : null}

      {/* ── Data row ── */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[12px] sm:text-[13px] text-muted mb-4">
        <span className="font-semibold text-ink">{feeLabel}</span>
        <span className="text-border">·</span>
        <span>{durationLabel}</span>
        <span className="text-border">·</span>
        <span>{MODE_LABEL[program.mode]}</span>
      </div>

      {/* ── Tags — browse mode only ── */}
      {!showReasoning && program.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {program.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-full bg-bg border border-border text-[11px] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ── Eligibility ── */}
      <div className="flex flex-wrap gap-1.5 items-baseline border-t border-border pt-3">
        <span className="text-[11px] font-bold text-teal uppercase tracking-wide">
          Eligibility
        </span>
        <span className="text-[12px] text-muted leading-relaxed">
          {program.eligibility}
        </span>
      </div>
    </article>
  );
}

function formatDuration(months: number): string {
  if (months < 12) return `${months}mo`;
  const years = months / 12;
  return `${years % 1 === 0 ? years : years.toFixed(1)}yr`;
}

function formatFeeRange(min: number, max: number): string {
  const fmt = (n: number) =>
    n >= 100_000
      ? `₹${(n / 100_000).toFixed(n % 100_000 === 0 ? 0 : 1)}L`
      : `₹${(n / 1_000).toFixed(0)}k`;
  return `${fmt(min)} – ${fmt(max)}`;
}
