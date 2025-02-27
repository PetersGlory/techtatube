"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { YoutubeForm } from "@/components/youtube-form";
import { VideoList } from "@/components/video-list";
import { Card } from "@/components/ui/card";
import { Video } from "@/convex/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function VideosPage() {
  const { user, isLoaded } = useUser();
  const videos = useQuery(api.videos.getUserVideos, {
    userId: user?.id ?? "skip",
  }) as Video[] | undefined;

  if (!isLoaded) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Video Processing</h1>
          <p className="text-muted-foreground">
            Submit a YouTube video URL to generate titles and thumbnails.
          </p>
        </div>

        <Card className="p-6">
          <YoutubeForm />
        </Card>

        <VideoList videos={videos ?? []} />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}