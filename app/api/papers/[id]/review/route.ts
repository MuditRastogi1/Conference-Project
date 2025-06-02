import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Paper from "@/models/Paper";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const { reviewerId, suggestion } = await req.json();

  if (!reviewerId || !suggestion) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const paper = await Paper.findById(params.id);
  if (!paper) {
    return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  }

  paper.reviews.push({ reviewerId, suggestion });
  await paper.save();

  return NextResponse.json({ success: true });
}