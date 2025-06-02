import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Paper from "@/models/Paper";
import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const abstract = formData.get("abstract") as string;
  const authorId = formData.get("authorId") as string;
  const file = formData.get("file") as File;

  if (!title || !abstract || !authorId || !file) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Save PDF to GridFS
  const client = await (await import("mongoose")).default.connection.getClient();
  const db = client.db();
  const bucket = new GridFSBucket(db, { bucketName: "papers" });

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const uploadStream = bucket.openUploadStream(file.name, {
    contentType: file.type,
  });
  uploadStream.end(fileBuffer);

  const fileId = uploadStream.id;

  // Save paper metadata
  const paper = await Paper.create({
    title,
    abstract,
    authorId,
    fileId,
    fileName: file.name,
    reviews: [],
  });

  return NextResponse.json({ success: true, paper });
}

export async function GET() {
  await connectToDatabase();
  const papers = await Paper.find().lean();
  return NextResponse.json(papers);
}