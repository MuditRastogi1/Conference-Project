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
  fileId: String,
  fileName: String,
  assignedReviewerId: String, // to assign reviewer
  reviews: [ReviewSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Paper || mongoose.model("Paper", PaperSchema);