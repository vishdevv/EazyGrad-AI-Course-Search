import Anthropic from "@anthropic-ai/sdk";
import type { Program, MatchResult, AISearchResponse, AIMatchItem, NoMatchReason } from "@/types";

export interface MatcherResult {
  matches: MatchResult[];
  noMatchReason?: NoMatchReason;
  noMatchMessage?: string;
}

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY environment variable is not set. Add it to .env.local."
      );
    }
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

function buildSystemPrompt(programs: Program[]): string {
  const catalog = programs.map((p) => ({
    id: p._id,
    name: p.name,
    provider: p.provider,
    degreeType: p.degreeType,
    specialization: p.specialization,
    durationMonths: p.durationMonths,
    feeRange: `₹${(p.feeMin / 1000).toFixed(0)}k–₹${(p.feeMax / 1000).toFixed(0)}k`,
    description: p.description,
    eligibility: p.eligibility,
    mode: p.mode,
    tags: p.tags.join(", "),
  }));

  return `You are an academic advisor at EazyGrad, an online degree discovery platform.

A student has described their background and career goals. Your job is to identify the most relevant programs from the catalog below and explain — in plain language — why each is a good fit for that specific student.

PROGRAM CATALOG:
${JSON.stringify(catalog, null, 2)}

INSTRUCTIONS:
- Return ONLY programs that genuinely match the student's query. Do not pad results with weak matches.
- Return a minimum of 3 programs if reasonable matches exist; never more than 8.
- Rank by relevance (most relevant first).
- For each match, write 1–2 sentences (20–40 words) of reasoning that: (a) references the student's specific background — their current role, years of experience, or stated goal — by name, and (b) explains exactly why THIS program fits that situation better than a generic alternative. Avoid vague labels like "good for career switch" or "suits IT background". Write like a sharp human counsellor talking directly to the student.
- relevanceScore must be an integer from 1 to 10 (10 = perfect fit).

RESPONSE FORMAT — return valid JSON only, no markdown fences, no extra text:
{
  "matches": [
    {
      "programId": "<the program _id string>",
      "reasoning": "<one sentence tailored to the student's query>",
      "relevanceScore": <integer 1–10>
    }
  ]
}

If no programs match, return:
{
  "matches": [],
  "noMatchReason": "<one of: catalog_gap | off_topic | vague>",
  "noMatchMessage": "<one sentence for the student explaining why, written directly to them>"
}

noMatchReason values:
- "catalog_gap": The student's goal is valid and education-related, but we don't offer programs in that domain (e.g. medical, law, arts, engineering). In noMatchMessage, tell them what domains we DO cover: management, technology, and commerce degrees.
- "vague": The query is too vague to match anything meaningful — we need more info about their background or goal.
- "off_topic": The query is a greeting, random question, or completely unrelated to education or careers.

CRITICAL: You MUST respond with valid JSON only — never reply conversationally, never ask for clarification.`;
}

function parseAIResponse(raw: string): AISearchResponse | null {
  // Strip markdown code fences if model wraps output despite instructions
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return null;
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !Array.isArray((parsed as Record<string, unknown>).matches)
  ) {
    return null;
  }

  const obj = parsed as Record<string, unknown>;
  const items = (obj.matches as unknown[]);
  const validated: AIMatchItem[] = [];

  for (const item of items) {
    if (
      typeof item !== "object" ||
      item === null ||
      typeof (item as Record<string, unknown>).programId !== "string" ||
      typeof (item as Record<string, unknown>).reasoning !== "string" ||
      typeof (item as Record<string, unknown>).relevanceScore !== "number" ||
      !Number.isFinite((item as Record<string, unknown>).relevanceScore)
    ) {
      continue;
    }
    validated.push(item as AIMatchItem);
  }

  const VALID_REASONS = new Set(["catalog_gap", "off_topic", "vague"]);
  const noMatchReason =
    typeof obj.noMatchReason === "string" && VALID_REASONS.has(obj.noMatchReason)
      ? (obj.noMatchReason as "catalog_gap" | "off_topic" | "vague")
      : undefined;
  const noMatchMessage =
    typeof obj.noMatchMessage === "string" ? obj.noMatchMessage : undefined;

  return { matches: validated, noMatchReason, noMatchMessage };
}

export async function findMatchingPrograms(
  query: string,
  programs: Program[]
): Promise<MatcherResult> {
  const systemPrompt = buildSystemPrompt(programs);

  const message = await getClient().messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    temperature: 0.3,
    system: systemPrompt,
    messages: [{ role: "user", content: query }],
  });

  const raw = message.content[0]?.type === "text" ? message.content[0].text : "";

  const aiResponse = parseAIResponse(raw);
  // If the model ignored the JSON instruction and replied conversationally,
  // treat it as off_topic with a generic message.
  if (!aiResponse) {
    return {
      matches: [],
      noMatchReason: "off_topic",
      noMatchMessage: "This doesn't look like an education query. Try describing your background or the kind of degree you're looking for.",
    };
  }

  if (aiResponse.matches.length === 0) {
    return {
      matches: [],
      noMatchReason: aiResponse.noMatchReason,
      noMatchMessage: aiResponse.noMatchMessage,
    };
  }

  const programMap = new Map(programs.map((p) => [p._id, p]));

  const results: MatchResult[] = [];
  for (const match of aiResponse.matches) {
    const program = programMap.get(match.programId);
    if (!program) continue;

    results.push({
      program,
      reasoning: match.reasoning,
      relevanceScore: Math.min(10, Math.max(1, Math.round(match.relevanceScore))),
    });
  }

  return { matches: results };
}
