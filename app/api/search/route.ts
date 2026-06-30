import { NextRequest, NextResponse } from "next/server";
import { RateLimitError } from "@anthropic-ai/sdk";
import { connectDB } from "@/lib/db";
import { ProgramModel } from "@/models/Program";
import { findMatchingPrograms } from "@/lib/matcher";
import type { SearchResponse, SearchErrorResponse, Program } from "@/types";

function formatRetryAfter(headers: Headers | undefined): string | null {
  const raw = headers?.get("retry-after");
  if (!raw) return null;
  const seconds = Number(raw);
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  const minutes = Math.ceil(seconds / 60);
  return minutes <= 1 ? "about a minute" : `about ${minutes} minutes`;
}

const MIN_QUERY_LENGTH = 5;
const MAX_QUERY_LENGTH = 500;

export async function POST(req: NextRequest): Promise<NextResponse> {
  let query: string;

  try {
    const body: unknown = await req.json();
    if (
      typeof body !== "object" ||
      body === null ||
      typeof (body as Record<string, unknown>).query !== "string"
    ) {
      return NextResponse.json<SearchErrorResponse>(
        { error: "Request body must be { query: string }.", code: "EMPTY_QUERY" },
        { status: 400 }
      );
    }
    query = ((body as Record<string, unknown>).query as string).trim();
  } catch {
    return NextResponse.json<SearchErrorResponse>(
      { error: "Invalid JSON in request body.", code: "EMPTY_QUERY" },
      { status: 400 }
    );
  }

  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json<SearchErrorResponse>(
      {
        error: `Query is too short. Please describe your background or goals in at least ${MIN_QUERY_LENGTH} characters.`,
        code: "EMPTY_QUERY",
      },
      { status: 400 }
    );
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json<SearchErrorResponse>(
      {
        error: `Query is too long. Please keep it under ${MAX_QUERY_LENGTH} characters.`,
        code: "EMPTY_QUERY",
      },
      { status: 400 }
    );
  }

  try {
    await connectDB();
  } catch {
    return NextResponse.json<SearchErrorResponse>(
      {
        error: "Unable to reach the database. Please try again in a moment.",
        code: "DB_ERROR",
      },
      { status: 503 }
    );
  }

  let programs: Program[];
  try {
    const docs = await ProgramModel.find({}).lean();
    // toJSON transform doesn't run on .lean() — serialise _id manually
    programs = docs.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    })) as Program[];
  } catch {
    return NextResponse.json<SearchErrorResponse>(
      {
        error: "Failed to load program catalog. Please try again.",
        code: "DB_ERROR",
      },
      { status: 503 }
    );
  }

  if (programs.length === 0) {
    return NextResponse.json<SearchErrorResponse>(
      {
        error: "No programs are available right now. Please try again later.",
        code: "DB_ERROR",
      },
      { status: 503 }
    );
  }

  let result;
  try {
    result = await findMatchingPrograms(query, programs);
  } catch (err) {
    console.error("AI matching failed:", err);

    if (err instanceof RateLimitError) {
      const wait = formatRetryAfter(err.headers);
      return NextResponse.json<SearchErrorResponse>(
        {
          error: wait
            ? `Our AI matching service has hit its usage limit for now. Please try again in ${wait}.`
            : "Our AI matching service has hit its usage limit for now. Please try again shortly.",
          code: "RATE_LIMIT",
        },
        { status: 429 }
      );
    }

    return NextResponse.json<SearchErrorResponse>(
      {
        error: "AI matching failed. Please try again in a moment.",
        code: "AI_ERROR",
      },
      { status: 502 }
    );
  }

  return NextResponse.json<SearchResponse>(
    {
      matches: result.matches,
      totalMatches: result.matches.length,
      noMatchReason: result.noMatchReason,
      noMatchMessage: result.noMatchMessage,
    },
    { status: 200 }
  );
}
