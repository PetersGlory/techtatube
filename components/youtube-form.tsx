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
        setIsLoading(false);
        return;
      }

      // Log the extracted ID for debugging
      console.log("Extracted YouTube ID:", youtubeId);

      const videoId = await createVideo({
        userId: user!.id,
        youtubeUrl: url.trim(),
      });

      showToast.loading("Processing", "Starting video analysis...");

      // Ensure we're sending the correct format
      const response = await fetch("/api/videos/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          videoId, 
          youtubeId, 
          userId: user!.id,
          youtubeUrl: url.trim() // Add the full URL as well
        }),
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

// Improved YouTube ID extraction function
function extractYoutubeId(url: string) {
  // Handle various YouTube URL formats
  try {
    // Standard YouTube URL format
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[7].length === 11) {
      return match[7];
    }
    
    // Handle youtu.be format
    const shortUrlRegExp = /^(https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})$/;
    const shortMatch = url.match(shortUrlRegExp);
    
    if (shortMatch) {
      return shortMatch[2];
    }
    
    // Handle direct ID input (if user just pastes the ID)
    if (url.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }
    
    return null;
  } catch (error) {
    console.error("Error extracting YouTube ID:", error);
    return null;
  }
} 