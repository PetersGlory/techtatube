"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { showToast } from "@/lib/toast-utils";
import { Id } from "@/convex/_generated/dataModel";

interface RetryAnalysisButtonProps {
  videoId: Id<"videos">;
  youtubeUrl: string;
}

export function RetryAnalysisButton({ videoId, youtubeUrl }: RetryAnalysisButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetryAnalysis = async () => {
    if (isRetrying) return;

    setIsRetrying(true);
    try {
      const youtubeId = extractYoutubeId(youtubeUrl);
      if (!youtubeId) {
        throw new Error("Invalid YouTube URL");
      }

      showToast.loading("Retrying", "Starting video analysis...");

      const response = await fetch("/api/videos/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, youtubeId }),
      });

      if (!response.ok) {
        throw new Error("Failed to process video");
      }

      showToast.success("Success", "Analysis started");
    } catch (error) {
      console.error("Error:", error);
      showToast.error(
        "Error",
        error instanceof Error ? error.message : "Failed to retry analysis"
      );
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleRetryAnalysis}
      disabled={isRetrying}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
      Retry Analysis
    </Button>
  );
}

function extractYoutubeId(url: string) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
} 