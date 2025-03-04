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
import { FileText, MessageSquare, BarChart, Wand2, Image, Type, AlertCircle, Lock } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { RetryAnalysisButton } from "@/components/retry-analysis-button";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast-utils";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getVideoDetails, VideoDetails } from "@/lib/youtube";
import { Progress } from "@/components/ui/progress";
import { SignInButton } from "@clerk/nextjs";

export default function VideoPage() {
  const { videoId } = useParams();
  const { user, isLoaded } = useUser();
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  
  const video = useQuery(api.videos.getVideo, { 
    videoId: videoId as Id<"videos"> 
  });

  const updateVideo = useMutation(api.videos.updateVideoStatus);
  
  const analysis = useQuery(api.analysis.getVideoAnalysis, { 
    videoId: videoId as Id<"videos"> 
  });

  const transcript = useQuery(api.transcripts.getVideoTranscript, {
    videoId: videoId as Id<"videos">
  });

  const generateTitle = useMutation(api.generations.create);
  const generateThumbnail = useMutation(api.generations.create);

  const handleGenerateTitle = async () => {
    if (!user) {
      showToast.error("Authentication Required", "Please sign in to generate titles");
      return;
    }

    try {
      showToast.loading("Generating", "Creating title variations...");
      const title = await generateTitle({
        videoId: video!._id,
        userId: user.id as Id<"users">,
        type: "title"
      });
      showToast.success("Success", "Title generation started");
      console.log(title);
    } catch (error) {
      showToast.error("Error", "Failed to start title generation");
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!user) {
      showToast.error("Authentication Required", "Please sign in to generate thumbnails");
      return;
    }

    try {
      showToast.loading("Generating", "Creating thumbnail variations...");
      const thumbnail = await generateThumbnail({
        videoId: video!._id,
        userId: user.id as Id<"users">,
        type: "image"
      });
      showToast.success("Success", "Thumbnail generation started");
      console.log(thumbnail);
    } catch (error) {
      showToast.error("Error", "Failed to start thumbnail generation");
    }
  };

  const updateStatus = async () => {
    if (!user) return;
    
    await updateVideo({
      videoId: videoId as Id<"videos">,
      status: "completed"
    });
  }

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

  if(video && videoDetails !== null && user){
    updateStatus();
  }

  const needsReprocessing = 
    user && (
      video.status === "failed" || 
      (!transcript && !analysis) ||
      (video.status === "completed" && (!transcript || !analysis))
    );

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
          <h1 className="text-2xl font-bold mb-2">Video Analysis</h1>
          {!user && isLoaded && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-start gap-3 mb-4">
              <Lock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-primary">Sign in to access all features</p>
                <p className="text-sm text-muted-foreground mb-2">Get access to AI analysis, title generation, and more.</p>
                <SignInButton mode="modal">
                  <Button variant="default" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
              </div>
            </div>
          )}
          {user && (
            <>
              <div className="flex items-center justify-between mb-2 w-auto">
                <Progress value={getProgressValue()} className="h-2" />
                <span className="text-sm font-medium ml-2">{getProgressValue()} / 100</span>
              </div>
              
              {video.status === "processing" && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3 mt-4">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-500">Processing your video</p>
                    <p className="text-sm text-muted-foreground">This may take a few minutes...</p>
                  </div>
                </div>
              )}
            </>
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
              {/* Channel Info */}
              {videoDetails?.channelTitle && (
                <div className="flex items-center gap-3 mb-4">
                  {videoDetails.channelThumbnail && (
                    <img 
                      src={videoDetails.channelThumbnail} 
                      alt={videoDetails.channelTitle}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{videoDetails.channelTitle}</h3>
                    {videoDetails.channelSubscribers && (
                      <p className="text-sm text-muted-foreground">
                        {formatNumber(videoDetails.channelSubscribers)} subscribers
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Video Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <Card className="p-3">
                  <p className="text-sm text-muted-foreground mb-1">Views</p>
                  <p className="text-lg font-semibold">{formatNumber(videoDetails?.views || 0)}</p>
                </Card>
                <Card className="p-3">
                  <p className="text-sm text-muted-foreground mb-1">Likes</p>
                  <p className="text-lg font-semibold">{formatNumber(videoDetails?.likes || 0)}</p>
                </Card>
                <Card className="p-3">
                  <p className="text-sm text-muted-foreground mb-1">Comments</p>
                  <p className="text-lg font-semibold">{formatNumber(videoDetails?.comments || 0)}</p>
                </Card>
                <Card className="p-3">
                  <p className="text-sm text-muted-foreground mb-1">Duration</p>
                  <p className="text-lg font-semibold">{videoDetails?.duration || '0:00'}</p>
                </Card>
              </div>

              {videoDetails?.description && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {videoDetails?.description}
                  </p>
                  <Button variant="link" size="sm" className="px-0 text-xs">
                    Show more
                  </Button>
                </div>
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
                  disabled={!user}
                >
                  <Type className="h-4 w-4 mr-2" />
                  Generate Title
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleGenerateThumbnail}
                  disabled={!user}
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
                    View on YouTube
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

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
} 