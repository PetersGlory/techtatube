/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoTranscript } from "@/components/video-transcript";
import { VideoChat } from "@/components/video-chat";
import { formatDistanceToNow } from "date-fns";
import { FileText, MessageSquare, BarChart, Wand2, Image, Type } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { RetryAnalysisButton } from "@/components/retry-analysis-button";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast-utils";

export default function VideoPage() {
  const { videoId } = useParams();
  
  const video = useQuery(api.videos.getVideo, { 
    videoId: videoId as Id<"videos"> 
  });
  
  const analysis = useQuery(api.analysis.getVideoAnalysis, { 
    videoId: videoId as Id<"videos"> 
  });

  const transcript = useQuery(api.transcripts.getVideoTranscript, {
    videoId: videoId as Id<"videos">
  });

  const generateTitle = useMutation(api.generationJobs.create);
  const generateThumbnail = useMutation(api.generationJobs.create);

  const handleGenerateTitle = async () => {
    try {
      showToast.loading("Generating", "Creating title variations...");
      await generateTitle({
        videoId: video!._id,
        userId: video!.userId,
        type: "title"
      });
      showToast.success("Success", "Title generation started");
    } catch (error) {
      showToast.error("Error", "Failed to start title generation");
    }
  };

  const handleGenerateThumbnail = async () => {
    try {
      showToast.loading("Generating", "Creating thumbnail variations...");
      await generateThumbnail({
        videoId: video!._id,
        userId: video!.userId,
        type: "image"
      });
      showToast.success("Success", "Thumbnail generation started");
    } catch (error) {
      showToast.error("Error", "Failed to start thumbnail generation");
    }
  };

  if (!video) return null;

  const needsReprocessing = 
    video.status === "failed" || 
    (!transcript && !analysis) ||
    (video.status === "completed" && (!transcript || !analysis));

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {/* Left Side - Video Analysis */}
      <div className="flex-1 overflow-auto">
        <Card className="p-4 mb-4">
          <div className="flex items-start gap-4">
            {video.thumbnailUrl && (
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-40 h-24 object-cover rounded-md"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold mb-2">{video.title}</h1>
                <div className="flex items-center gap-2">
                  {needsReprocessing && (
                    <RetryAnalysisButton 
                      videoId={video._id}
                      youtubeUrl={video.youtubeUrl}
                    />
                  )}
                  <Badge variant={
                    video.status === "completed" ? "success" : 
                    video.status === "failed" ? "destructive" : 
                    "secondary"
                  }>
                    {video.status}
                  </Badge>
                </div>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Processed {formatDistanceToNow(video.createdAt)} ago
              </div>
              {video.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {video.description}
                </p>
              )}
              
              {/* Quick Actions */}
              {video.status === "completed" && (
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleGenerateTitle}
                  >
                    <Type className="h-4 w-4 mr-2" />
                    Generate Title
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleGenerateThumbnail}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Generate Thumbnail
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                  >
                    <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">
                      <Wand2 className="h-4 w-4 mr-2" />
                      Enhance Video
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Tabs defaultValue="transcript">
          <TabsList>
            <TabsTrigger value="transcript">
              <FileText className="w-4 h-4 mr-2" />
              Transcript
            </TabsTrigger>
            <TabsTrigger value="analysis">
              <BarChart className="w-4 h-4 mr-2" />
              Analysis
            </TabsTrigger>
          </TabsList>
          <TabsContent value="transcript" className="mt-4">
            {transcript ? (
              <VideoTranscript videoId={video._id} />
            ) : (
              <Card className="p-4">
                <p className="text-muted-foreground">
                  {video.status === "processing" 
                    ? "Transcript is being generated..." 
                    : "No transcript available"}
                </p>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="analysis" className="mt-4">
            {analysis ? (
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    {analysis.summary}
                  </p>
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Key Points</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.keyPoints.map((point, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        {point}
                      </li>
                    ))}
                  </ul>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Sentiment</h3>
                    <Badge>{analysis.sentiment}</Badge>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Content Rating</h3>
                    <Badge>{analysis.contentRating}</Badge>
                  </Card>
                </div>

                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Suggested Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.suggestedTags.map((tag, i) => (
                      <Badge key={i} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-4">
                <p className="text-muted-foreground">
                  {video.status === "processing" 
                    ? "Analysis is in progress..." 
                    : "No analysis available"}
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Side - Chat */}
      <div className="w-[400px] border-l bg-muted/50">
        <div className="p-4 border-b bg-background">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            AI Assistant
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Chat with AI about the video content
          </p>
        </div>
        {video.status === "completed" ? (
          <VideoChat 
            videoId={video._id} 
            transcript={transcript?.content}
            analysis={analysis}
          />
        ) : (
          <div className="p-4 text-sm text-muted-foreground">
            Chat will be available once video processing is complete.
          </div>
        )}
      </div>
    </div>
  );
} 