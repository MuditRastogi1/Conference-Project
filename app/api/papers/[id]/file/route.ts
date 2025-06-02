import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { GridFSBucket, ObjectId } from "mongodb";
import mongoose from "mongoose";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const client = mongoose.connection.getClient();
  const db = client.db();
  const bucket = new GridFSBucket(db, { bucketName: "papers" });

  const fileId = new ObjectId(params.id);

  const files = await bucket.find({ _id: fileId }).toArray();
  if (!files.length) {
    return new Response("File not found", { status: 404 });
  }

  const downloadStream = bucket.openDownloadStream(fileId);

  return new Response(downloadStream as any, {
    headers: {
      "Content-Type": files[0].contentType || "application/pdf",
      "Content-Disposition": `attachment; filename="${files[0].filename}"`,
    },
  });
}