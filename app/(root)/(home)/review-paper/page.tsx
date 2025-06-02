"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type Paper = {
  _id: string;
  title: string;
  abstract: string;
  authorId: string;
  fileId: string;
  fileName: string;
  reviews: { reviewerId: string; suggestion: string; createdAt: string }[];
};

const ReviewPaperPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [suggestion, setSuggestion] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isLoaded && user?.publicMetadata.role !== "reviewer") {
      router.replace("/");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    fetch("/api/papers")
      .then(res => res.json())
      .then(setPapers);
  }, []);

  const handleSuggestion = async (paperId: string) => {
    await fetch(`/api/papers/${paperId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reviewerId: user?.id,
        suggestion: suggestion[paperId],
      }),
    });
    setSuggestion(prev => ({ ...prev, [paperId]: "" }));
    alert("Suggestion submitted!");
    // Optionally, refresh papers to show new review
    fetch("/api/papers")
      .then(res => res.json())
      .then(setPapers);
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Papers for Review</h1>
      <div className="w-full max-w-2xl space-y-6">
        {papers.length === 0 && <p>No papers submitted yet.</p>}
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
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSuggestion(paper._id);
              }}
              className="mt-2"
            >
              <textarea
                value={suggestion[paper._id] || ""}
                onChange={e =>
                  setSuggestion(prev => ({
                    ...prev,
                    [paper._id]: e.target.value,
                  }))
                }
                placeholder="Suggest changes..."
                className="w-full p-2 rounded text-black"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Submit Suggestion
              </button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewPaperPage;