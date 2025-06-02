"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

type Paper = {
  _id: string;
  title: string;
  abstract: string;
  authorId: string;
  fileId: string;
  fileName: string;
  assignedReviewerId?: string;
  reviews: { reviewerId: string; suggestion: string; createdAt: string }[];
};

type Reviewer = {
  id: string;
  name: string;
};

const AdminDashboard = () => {
  const { user } = useUser();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [selectedReviewer, setSelectedReviewer] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetch("/api/papers")
      .then(res => res.json())
      .then(setPapers);
  }, []);

  // Fetch real reviewers from API
  useEffect(() => {
    fetch("/api/reviewers")
      .then(res => res.json())
      .then(setReviewers);
  }, []);

  const assignReviewer = async (paperId: string) => {
    await fetch(`/api/papers/${paperId}/assign-reviewer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewerId: selectedReviewer[paperId] }),
    });
    alert("Reviewer assigned!");
    fetch("/api/papers")
      .then(res => res.json())
      .then(setPapers);
  };

  if (user?.publicMetadata.role !== "admin") {
    return <div className="text-red-500">Access denied. Admins only.</div>;
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="w-full max-w-2xl space-y-6">
        {papers.map(paper => (
          <div key={paper._id} className="bg-dark-3 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{paper.title}</h2>
            <p className="mb-2">{paper.abstract}</p>
            <a
              href={`/api/papers/${paper.fileId}/file`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              View PDF
            </a>
            <div className="mt-2">
              <label className="block mb-1 font-bold">Assign Reviewer:</label>
              <select
                value={selectedReviewer[paper._id] || paper.assignedReviewerId || ""}
                onChange={e =>
                  setSelectedReviewer(prev => ({
                    ...prev,
                    [paper._id]: e.target.value,
                  }))
                }
                className="text-black rounded p-1"
              >
                <option value="">Select Reviewer</option>
                {reviewers.map(reviewer => (
                  <option key={reviewer.id} value={reviewer.id}>
                    {reviewer.name}
                  </option>
                ))}
              </select>
              <button
                className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => assignReviewer(paper._id)}
                disabled={!selectedReviewer[paper._id]}
              >
                Assign
              </button>
              {paper.assignedReviewerId && (
                <div className="mt-2 text-green-400">
                  Assigned to: {reviewers.find(r => r.id === paper.assignedReviewerId)?.name || paper.assignedReviewerId}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminDashboard;