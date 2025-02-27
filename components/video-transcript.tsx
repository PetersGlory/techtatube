"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VideoTranscriptProps {
  videoId: Id<"videos">;
}

export function VideoTranscript({ videoId }: VideoTranscriptProps) {
  const transcript = useQuery(api.transcripts.getVideoTranscript, { 
    videoId 
  });

  if (!transcript) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground">No transcript available</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Transcript</h3>
      <ScrollArea className="h-[200px]">
        <p className="text-sm whitespace-pre-wrap">{transcript.content}</p>
      </ScrollArea>
    </Card>
  );
} 