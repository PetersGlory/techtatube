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
  // Create a textarea element to decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  
  // Get the decoded text
  let decoded = textarea.value;
  
  // Additional cleanup
  decoded = decoded
    // Replace common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    // Remove any remaining HTML entities
    .replace(/&#?[a-zA-Z0-9]+;/g, ' ')
    // Fix multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
    
  return decoded;
}

// Function to clean up text before displaying
function cleanupText(text: string): string {
  return text
    // Ensure proper spacing after punctuation
    .replace(/([.!?])\s*/g, '$1 ')
    // Remove extra spaces
    .replace(/\s+/g, ' ')
    .trim();
}

// Function to format seconds to MM:SS format
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Function to parse transcript into segments with timestamps
function parseTranscript(content: string): TranscriptSegment[] {
  const segments: TranscriptSegment[] = [];
  
  // First decode HTML entities
  const decodedContent = decodeHtmlEntities(content);
  
  // Split content into sentences and clean up
  const sentences = decodedContent
    .replace(/([.!?])\s+/g, '$1\n')  // Split on sentence endings
    .split('\n')
    .map(s => cleanupText(s))
    .filter(s => s.length > 0);
  
  let currentTime = 0;
  const averageSecondsPerSentence = 4;  // Approximate timing
  
  sentences.forEach((sentence) => {
    if (sentence) {
      segments.push({
        text: sentence,
        timestamp: formatTime(currentTime)
      });
      // Estimate time based on sentence length
      const words = sentence.split(/\s+/).length;
      currentTime += Math.max(averageSecondsPerSentence, words * 0.4);
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
      <div className="px-4 py-3 border-b flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Video Transcript</span>
          <span className="text-xs text-muted-foreground">
            ({filteredSegments.length} segments)
          </span>
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
      
      <div className="p-3 border-b bg-background">
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
        <div className="divide-y divide-border/50">
          {filteredSegments.length > 0 ? (
            filteredSegments.map((segment, index) => (
              <div 
                key={index} 
                className="p-4 hover:bg-muted/50 transition-colors flex gap-4 group"
              >
                <div className="flex-shrink-0 w-16">
                  <div className="flex items-center text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md group-hover:bg-muted">
                    <Clock className="h-3 w-3 mr-1" />
                    {segment.timestamp}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">
                    {searchTerm ? (
                      highlightText(segment.text, searchTerm)
                    ) : (
                      segment.text
                    )}
                  </p>
                </div>
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