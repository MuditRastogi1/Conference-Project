import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Paper from "@/models/Paper";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const { reviewerId } = await req.json();

  if (!reviewerId) {
    return NextResponse.json({ error: "Missing reviewerId" }, { status: 400 });
  }

  const paper = await Paper.findById(params.id);
  if (!paper) {
    return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  }

  paper.assignedReviewerId = reviewerId;
  await paper.save();

  return NextResponse.json({ success: true });
}