/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollText, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HistoryPage() {
  const { user, isLoaded } = useUser();
  
  const videos = useQuery(api.videos.getUserVideos, {
    userId: user?.id ?? "skip",
  });

  if (!isLoaded) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Processing History</h1>
        <p className="text-muted-foreground">
          View all your processed videos and their analyses
        </p>
      </div>

      <div className="space-y-6">
        {videos?.map((video) => (
          <Card key={video._id} className="p-6">
            <div className="flex items-start gap-4">
              {video.thumbnailUrl && (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-40 h-24 object-cover rounded-md"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{video.title}</h3>
                  <Badge variant={video.status === "completed" ? "success" : "secondary"}>
                    {video.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {video.status === "completed" && (
                    <>
                      <div className="flex items-center gap-1">
                        <ScrollText className="w-4 h-4" />
                        <span>Transcript Available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>Analysis Complete</span>
                      </div>
                    </>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mt-2">
                  Processed {formatDistanceToNow(video.createdAt)} ago
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="space-y-6">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex gap-4">
              <Skeleton className="w-40 h-24" />
              <div className="flex-1">
                <Skeleton className="h-6 w-64 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 