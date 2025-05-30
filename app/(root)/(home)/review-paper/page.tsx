"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ReviewPaperPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user?.publicMetadata.role !== "reviewer") {
      router.replace("/");
    }
  }, [isLoaded, user, router]);

  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-3xl font-bold">Review Papers</h1>
      <p>Only reviewers can see this page.</p>
      {/* Add your review paper functionality here */}
    </section>
  );
};

export default ReviewPaperPage;