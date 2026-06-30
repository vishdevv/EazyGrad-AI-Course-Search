import type { MatchResult } from "@/types";

interface ProgramCardProps {
  match: MatchResult;
  rank: number;
}

const MODE_LABEL: Record<"online" | "hybrid", string> = {
  online: "100% Online",
  hybrid: "Hybrid",
};

export default function ProgramCard({ match, rank }: ProgramCardProps) {
  const { program, reasoning, relevanceScore } = match;

  const durationLabel = formatDuration(program.durationMonths);
  const feeLabel = formatFeeRange(program.feeMin, program.feeMax);

  return (
    <article
      className="group relative flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 hover:border-blue-200 hover:shadow-md transition-all duration-150"
      aria-label={`${program.name} from ${program.provider}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              {program.degreeType}
            </span>
            <span className="text-xs text-gray-400">{program.provider}</span>
          </div>
          <h2 className="text-base font-semibold text-gray-900 leading-snug">
            {program.name}
          </h2>
        </div>

        {/* Rank badge */}
        <div
          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-sm font-bold text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"
          aria-label={`Rank ${rank}`}
        >
          {rank}
        </div>
      </div>

      {/* AI reasoning — the core value prop */}
      <div className="flex gap-2.5 rounded-lg bg-amber-50 px-4 py-3 border border-amber-100">
        <SparklesIcon />
        <p className="text-sm text-amber-900 leading-relaxed">{reasoning}</p>
      </div>

      {/* Stats row */}
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <Stat label="Duration" value={durationLabel} />
        <Stat label="Fee range" value={feeLabel} />
        <Stat label="Mode" value={MODE_LABEL[program.mode]} />
        <Stat label="Score" value={`${relevanceScore}/10`} highlight />
      </dl>

      {/* Eligibility */}
      <p className="text-xs text-gray-500 border-t border-gray-100 pt-3">
        <span className="font-medium text-gray-700">Eligibility: </span>
        {program.eligibility}
      </p>
    </article>
  );
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-gray-400 uppercase tracking-wide">{label}</dt>
      <dd
        className={`font-medium ${highlight ? "text-blue-600" : "text-gray-900"}`}
      >
        {value}
      </dd>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 mt-0.5 text-amber-600"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.784l-1.192.24a1 1 0 000 1.96l1.192.24a1 1 0 01.784.784l.24 1.192a1 1 0 001.96 0l.24-1.192a1 1 0 01.784-.784l1.192-.24a1 1 0 000-1.96l-1.192-.24a1 1 0 01-.784-.784l-.24-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.683a1 1 0 01.633.633l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.633.633l-.551.184a1 1 0 000 1.898l.551.184a1 1 0 01.633.633l.184.551a1 1 0 001.898 0l.184-.551a1 1 0 01.633-.633l.551-.184a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.633l-.184-.551z" />
    </svg>
  );
}

function formatDuration(months: number): string {
  if (months < 12) return `${months} months`;
  const years = months / 12;
  return years % 1 === 0 ? `${years} year${years > 1 ? "s" : ""}` : `${years} years`;
}

function formatFeeRange(min: number, max: number): string {
  const fmt = (n: number) =>
    n >= 100_000
      ? `₹${(n / 100_000).toFixed(n % 100_000 === 0 ? 0 : 1)}L`
      : `₹${(n / 1000).toFixed(0)}k`;
  return `${fmt(min)} – ${fmt(max)}`;
}
