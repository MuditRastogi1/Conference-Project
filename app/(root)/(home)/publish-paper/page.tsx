"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const PublishPaperPage = () => {
  const { user } = useUser();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({ title: "Paper submitted successfully!" });
      setTitle("");
      setAbstract("");
      setFile(null);
    }, 1500);
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
    </section>
  );
};

export default PublishPaperPage;