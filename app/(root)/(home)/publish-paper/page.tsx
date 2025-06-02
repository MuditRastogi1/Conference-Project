"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Review = {
  reviewerId: string;
  suggestion: string;
  createdAt: string;
};

type Paper = {
  _id: string;
  title: string;
  abstract: string;
  authorId: string;
  fileId: string;
  fileName: string;
  reviews: Review[];
};

const PublishPaperPage = () => {
  const { user } = useUser();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myPapers, setMyPapers] = useState<Paper[]>([]);

  // Fetch papers authored by the current user
  useEffect(() => {
    if (!user?.id) return;
    fetch("/api/papers")
      .then(res => res.json())
      .then(data => {
        setMyPapers(data.filter((paper: Paper) => paper.authorId === user.id));
      });
  }, [user]);

  // Handle paper submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("abstract", abstract);
    formData.append("file", file as File);
    formData.append("authorId", user?.id || "");

    const res = await fetch("/api/papers", {
      method: "POST",
      body: formData,
    });

    setIsSubmitting(false);

    if (res.ok) {
      toast({ title: "Paper submitted successfully!" });
      setTitle("");
      setAbstract("");
      setFile(null);
      // Refresh papers list
      fetch("/api/papers")
        .then(res => res.json())
        .then(data => {
          setMyPapers(data.filter((paper: Paper) => paper.authorId === user?.id));
        });
    } else {
      toast({ title: "Failed to submit paper", variant: "destructive" });
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen gap-8 text-white">
      <h1 className="text-3xl font-bold">Publish Research Paper</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-dark-3 rounded-lg p-8 flex flex-col gap-6 w-full max-w-xl shadow-lg"
      >
        <div>
          <label className="block text-sky-1 font-medium mb-2">Title</label>
          <input
            type="text"
            className="w-full rounded-md px-3 py-2 text-black dark:text-white bg-white dark:bg-dark-2 border border-slate-300 dark:border-dark-4 focus:outline-none focus:ring-2 focus:ring-blue-1"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="Enter paper title"
          />
        </div>
        <div>
          <label className="block text-sky-1 font-medium mb-2">Abstract</label>
          <Textarea
            className="bg-white dark:bg-dark-2 text-black dark:text-white"
            value={abstract}
            onChange={e => setAbstract(e.target.value)}
            required
            placeholder="Enter abstract"
            rows={5}
          />
        </div>
        <div>
          <label className="block text-sky-1 font-medium mb-2">Upload PDF</label>
          <input
            type="file"
            accept="application/pdf"
            className="w-full text-white"
            onChange={e => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>
        <Button
          type="submit"
          className="bg-blue-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Publish Paper"}
        </Button>
      </form>

      {/* List of submitted papers and reviewer suggestions */}
      <div className="w-full max-w-xl mt-10">
        <h2 className="text-2xl font-bold mb-4">Your Submitted Papers & Suggestions</h2>
        {myPapers.length === 0 && <p>No papers submitted yet.</p>}
        {myPapers.map(paper => (
          <div key={paper._id} className="bg-dark-3 p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold">{paper.title}</h3>
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
              <h4 className="font-bold">Reviewer Suggestions:</h4>
              {paper.reviews.length === 0 && <p>No suggestions yet.</p>}
              {paper.reviews.map((review, idx) => (
                <div key={idx} className="bg-dark-2 p-2 rounded my-1">
                  <p>{review.suggestion}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PublishPaperPage;