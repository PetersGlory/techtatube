/* eslint-disable react-hooks/rules-of-hooks */
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
import { FileText, MessageSquare, BarChart, Wand2, Image, Type, AlertCircle } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { RetryAnalysisButton } from "@/components/retry-analysis-button";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast-utils";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getVideoDetails, VideoDetails } from "@/lib/youtube";
import { Progress } from "@/components/ui/progress";

export default function VideoPage() {
  const { videoId } = useParams();
  const {user} = useUser();
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  
  const video = useQuery(api.videos.getVideo, { 
    videoId: videoId as Id<"videos"> 
  });
  
  const analysis = useQuery(api.analysis.getVideoAnalysis, { 
    videoId: videoId as Id<"videos"> 
  });

  const transcript = useQuery(api.transcripts.getVideoTranscript, {
    videoId: videoId as Id<"videos">
  });

  const generateTitle = useMutation(api.generations.create);
  const generateThumbnail = useMutation(api.generations.create);

  const handleGenerateTitle = async () => {
    try {
      showToast.loading("Generating", "Creating title variations...");
      await generateTitle({
        videoId: video!._id,
        userId: user!.id as Id<"users">,
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
        userId: user!.id as Id<"users">,
        type: "image"
      });
      showToast.success("Success", "Thumbnail generation started");
    } catch (error) {
      showToast.error("Error", "Failed to start thumbnail generation");
    }
  };
  
  useEffect(() => {
    const fetchVideoDetails = async () => {
      if(video){
        const videoDetails = await getVideoDetails(video.youtubeId);
        setVideoDetails(videoDetails);
      }
    }
    fetchVideoDetails();
  }, [video]);

  if (!video) return null;

  const needsReprocessing = 
    video.status === "failed" || 
    (!transcript && !analysis) ||
    (video.status === "completed" && (!transcript || !analysis));

  // Calculate progress based on status
  const getProgressValue = () => {
    switch(video.status) {
      case "processing": return 60;
      case "completed": return 100;
      case "failed": return 100;
      default: return 30;
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 py-4 w-full">
      {/* Left Side - Video Analysis */}
      <div className="flex-1 overflow-auto px-2">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Analyse Video</h1>
          <div className="flex items-center justify-between mb-2 w-auto">
            <Progress value={getProgressValue()} className="h-2" />
            <span className="text-sm font-medium ml-2">{getProgressValue()} / 100</span>
          </div>
          
          {video.status === "processing" && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3 mt-4">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium text-amber-500">This is your first time analysing this video</p>
                <p className="text-sm text-muted-foreground">(1 analysis token is being used!)</p>
              </div>
            </div>
          )}
        </div>

        <Card className="p-4 mb-6 overflow-hidden">
          {videoDetails?.thumbnail && (
            <div className="relative w-full h-[500px] mb-4 rounded-md overflow-hidden">
              <img
                src={videoDetails.thumbnail}
                alt={videoDetails.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-4 w-full">
                  <h1 className="text-2xl font-bold text-white mb-2">{videoDetails?.title}</h1>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      video.status === "completed" ? "success" : 
                      video.status === "failed" ? "destructive" : 
                      "secondary"
                    }>
                      {video.status}
                    </Badge>
                    <span className="text-sm text-white/80">
                      Processed {formatDistanceToNow(videoDetails?.publishedAt || new Date())} ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-start gap-4">
            <div className="flex-1">
              {videoDetails?.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {videoDetails?.description}
                </p>
              )}
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                {needsReprocessing && (
                  <RetryAnalysisButton 
                    videoId={video._id}
                    youtubeUrl={video.youtubeUrl}
                  />
                )}
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
            </div>
          </div>
        </Card>

        <Tabs defaultValue="transcript">
          <TabsList className="mb-4">
            <TabsTrigger value="transcript">
              <FileText className="w-4 h-4 mr-2" />
              Transcript
            </TabsTrigger>
            <TabsTrigger value="analysis">
              <BarChart className="w-4 h-4 mr-2" />
              Analysis
            </TabsTrigger>
          </TabsList>
          <TabsContent value="transcript">
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
          <TabsContent value="analysis">
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
        {video ?(
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