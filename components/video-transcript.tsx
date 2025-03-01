"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VideoTranscriptProps {
  videoId: Id<"videos">;
}

function decodeHtmlEntities(str: string) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
}

export function VideoTranscript({ videoId }: VideoTranscriptProps) {
  const transcript = useQuery(api.transcripts.getVideoTranscript, { 
    videoId 
  });

  if (!transcript) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No transcript available
      </Card>
    );
  }

  const content = decodeHtmlEntities(transcript.content);
  console.log("Decoded Content:", content);

  return (
    <Card className="flex flex-col h-full">
      <div className="px-4 py-2 border-b font-medium">
        Transcript
      </div>
      <ScrollArea className="w-full p-4 h-[300px]">
        {content}
      </ScrollArea>
    </Card>
  );
}