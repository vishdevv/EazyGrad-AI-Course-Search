import Anthropic from "@anthropic-ai/sdk";
import type { Program, MatchResult, AISearchResponse, AIMatchItem } from "@/types";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  throw new Error(
    "ANTHROPIC_API_KEY environment variable is not set. Add it to .env.local."
  );
}

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

/**
 * Builds the system prompt that instructs the model on its role and
 * the exact JSON schema it must return. Keeping prompt construction
 * in a pure function makes it independently testable.
 */
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
- For each match, write a single concise sentence (max 20 words) that directly references something the student said and explains the connection to the program.
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

If no programs match the query at all, return: { "matches": [] }`;
}

/**
 * Validates and parses the raw JSON string from the model response.
 * Returns null if the response is malformed or missing required fields.
 */
function parseAIResponse(raw: string): AISearchResponse | null {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw.trim());
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

  const items = (parsed as { matches: unknown[] }).matches;

  const validated: AIMatchItem[] = [];
  for (const item of items) {
    if (
      typeof item !== "object" ||
      item === null ||
      typeof (item as Record<string, unknown>).programId !== "string" ||
      typeof (item as Record<string, unknown>).reasoning !== "string" ||
      typeof (item as Record<string, unknown>).relevanceScore !== "number"
    ) {
      continue; // skip malformed items, don't fail the whole response
    }
    validated.push(item as AIMatchItem);
  }

  return { matches: validated };
}

/**
 * Main entry point. Accepts a natural language query and the full
 * program list, returns ranked MatchResult[] with reasoning.
 *
 * Throws on unrecoverable errors (API failure, completely malformed
 * response) so the API route can catch and return a typed error.
 */
export async function findMatchingPrograms(
  query: string,
  programs: Program[]
): Promise<MatchResult[]> {
  const systemPrompt = buildSystemPrompt(programs);

  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: query,
      },
    ],
  });

  const firstBlock = message.content[0];
  if (!firstBlock || firstBlock.type !== "text") {
    throw new Error("Unexpected response format from Claude API.");
  }

  const aiResponse = parseAIResponse(firstBlock.text);
  if (!aiResponse) {
    throw new Error(
      `Could not parse Claude response as valid JSON. Raw: ${firstBlock.text.slice(0, 200)}`
    );
  }

  // Build a lookup map to avoid O(n²) matching
  const programMap = new Map(programs.map((p) => [p._id, p]));

  const results: MatchResult[] = [];
  for (const match of aiResponse.matches) {
    const program = programMap.get(match.programId);
    if (!program) continue; // model hallucinated an id — skip safely

    results.push({
      program,
      reasoning: match.reasoning,
      relevanceScore: Math.min(10, Math.max(1, Math.round(match.relevanceScore))),
    });
  }

  return results;
}
