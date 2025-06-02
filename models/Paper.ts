import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema({
  reviewerId: String,
  suggestion: String,
  createdAt: { type: Date, default: Date.now },
});

const PaperSchema = new Schema({
  title: String,
  abstract: String,
  authorId: String,
  fileId: String, // GridFS file id
  fileName: String,
  reviews: [ReviewSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Paper || mongoose.model("Paper", PaperSchema);