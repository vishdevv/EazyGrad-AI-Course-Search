import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProgramModel } from "@/models/Program";
import type { Program } from "@/types";

export async function GET(): Promise<NextResponse> {
  try {
    await connectDB();
  } catch {
    return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  }

  let programs: Program[];
  try {
    const docs = await ProgramModel.find({}).lean();
    programs = docs.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    })) as Program[];
  } catch {
    return NextResponse.json({ error: "Failed to load program catalog." }, { status: 503 });
  }

  return NextResponse.json(programs);
}
