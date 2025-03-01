"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef } from "react";
import { Search, Clock, Copy, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast-utils";

interface VideoTranscriptProps {
  videoId: Id<"videos">;
}

interface TranscriptSegment {
  text: string;
  timestamp?: string;
}

function decodeHtmlEntities(str: string) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
}

// Function to format seconds to MM:SS format
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Function to parse transcript into segments with timestamps
function parseTranscript(content: string): TranscriptSegment[] {
  // Simple parsing - this can be enhanced based on your transcript format
  const segments: TranscriptSegment[] = [];
  let currentTime = 0;
  
  // Split by sentences (roughly)
  const sentences = content.split(/(?<=[.!?])\s+/);
  
  sentences.forEach((sentence, index) => {
    if (sentence.trim()) {
      // Estimate timestamp (this is just a placeholder - ideally you'd have real timestamps)
      // Assuming average of 3 seconds per sentence
      currentTime += 3;
      
      segments.push({
        text: sentence.trim(),
        timestamp: formatTime(currentTime)
      });
    }
  });
  
  return segments;
}

export function VideoTranscript({ videoId }: VideoTranscriptProps) {
  const transcript = useQuery(api.transcripts.getVideoTranscript, { videoId });
  const [searchTerm, setSearchTerm] = useState("");
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [filteredSegments, setFilteredSegments] = useState<TranscriptSegment[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcript?.content) {
      const content = decodeHtmlEntities(transcript.content);
      const parsed = parseTranscript(content);
      setSegments(parsed);
      setFilteredSegments(parsed);
    }
  }, [transcript]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = segments.filter(segment => 
        segment.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSegments(filtered);
    } else {
      setFilteredSegments(segments);
    }
  }, [searchTerm, segments]);

  const handleCopyTranscript = () => {
    if (transcript?.content) {
      const content = decodeHtmlEntities(transcript.content);
      navigator.clipboard.writeText(content);
      showToast.success("Copied", "Transcript copied to clipboard");
    }
  };

  if (!transcript) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="font-medium">No transcript available</p>
        <p className="text-sm mt-1">The transcript is still being processed or could not be generated.</p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Video Transcript</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCopyTranscript}
          className="h-8"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy All
        </Button>
      </div>
      
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transcript..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-0" ref={scrollAreaRef}>
        <div className="divide-y">
          {filteredSegments.length > 0 ? (
            filteredSegments.map((segment, index) => (
              <div 
                key={index} 
                className="p-3 hover:bg-muted/50 transition-colors flex gap-3"
              >
                {segment.timestamp && (
                  <div className="flex-shrink-0 w-12 flex items-center">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {segment.timestamp}
                    </div>
                  </div>
                )}
                <p className="text-sm flex-1">
                  {searchTerm ? (
                    highlightText(segment.text, searchTerm)
                  ) : (
                    segment.text
                  )}
                </p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm ? (
                <>
                  <p className="font-medium">No results found</p>
                  <p className="text-sm mt-1">Try a different search term</p>
                </>
              ) : (
                <p>Transcript is empty</p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}

// Helper function to highlight search terms in text
function highlightText(text: string, searchTerm: string) {
  if (!searchTerm) return text;
  
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === searchTerm.toLowerCase() ? 
          <span key={i} className="bg-yellow-200 text-black rounded px-0.5">{part}</span> : 
          part
      )}
    </>
  );
}