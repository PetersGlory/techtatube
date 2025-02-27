/* eslint-disable @next/next/no-img-element */
"use client";

import { Video } from "@/convex/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { VideoTranscript } from "@/components/video-transcript";

interface VideoListProps {
  videos: Video[];
}

export function VideoList({ videos }: VideoListProps) {
  if (!videos.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          No videos submitted yet. Add your first video above!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <Card key={video._id} className="p-4 space-y-4">
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
                <h3 className="font-semibold">{video.title || "Processing..."}</h3>
                <Badge variant={getStatusVariant(video.status)}>
                  {video.status}
                </Badge>
              </div>
              {video.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {video.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>Submitted {formatDistanceToNow(video.createdAt)} ago</span>
                {video.duration && <span>• Duration: {video.duration}</span>}
              </div>
            </div>
          </div>
          {video.status === "completed" && (
            <VideoTranscript videoId={video._id} />
          )}
        </Card>
      ))}
    </div>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case "completed":
      return "success";
    case "processing":
      return "warning";
    case "failed":
      return "destructive";
    default:
      return "secondary";
  }
} 