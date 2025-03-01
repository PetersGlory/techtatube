"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { showToast } from "@/lib/toast-utils";
import { useRouter } from "next/navigation";

export function YoutubeForm() {
  const { user } = useUser();
  const createVideo = useMutation(api.videos.createVideo);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const youtubeId = extractYoutubeId(url.trim());
      if (!youtubeId) {
        showToast.error("Invalid URL", "Please enter a valid YouTube URL");
        return;
      }

      const videoId = await createVideo({
        userId: user!.id,
        youtubeUrl: url.trim(),
      });

      showToast.loading("Processing", "Starting video analysis...");

      const response = await fetch("/api/videos/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, youtubeId, userId: user!.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process video");
      }

      showToast.success("Success", "Video analysis started");
      setUrl("");
      router.push(`/videos/${videoId}`);
    } catch (error) {
      console.error("Error:", error);
      showToast.error(
        "Error",
        error instanceof Error ? error.message : "Failed to process video"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter YouTube URL..."
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Processing..." : "Analyze"}
      </Button>
    </form>
  );
}

function extractYoutubeId(url: string) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
} 