"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VideoInsightsProps {
  videoId: string;
}

export function VideoInsights({ videoId }: VideoInsightsProps) {
  const analysis = useQuery(api.analysis.getVideoAnalysis, { videoId: videoId as any });

  if (!analysis) return null;

  return (
    <Card className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Summary</h3>
        <p className="text-sm text-muted-foreground">{analysis.summary}</p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Key Points</h3>
        <ul className="list-disc list-inside text-sm text-muted-foreground">
          {analysis.keyPoints.map((point: string, i: number) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Tags</h3>
        <div className="flex gap-2">
          {analysis.suggestedTags.map((tag: string, i: number) => (
            <Badge key={i} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <div>
          <h3 className="font-semibold mb-1">Sentiment</h3>
          <span className="text-sm text-muted-foreground capitalize">
            {analysis.sentiment}
          </span>
        </div>
        <div>
          <h3 className="font-semibold mb-1">Content Rating</h3>
          <span className="text-sm text-muted-foreground capitalize">
            {analysis.contentRating}
          </span>
        </div>
      </div>
    </Card>
  );
} 