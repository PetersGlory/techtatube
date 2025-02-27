"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { YoutubeForm } from "@/components/youtube-form";
import { VideoList } from "@/components/video-list";
import { Card } from "@/components/ui/card";

export default function VideosPage() {
  const { user } = useUser();
  const videos = useQuery(api.videos.getUserVideos, {
    userId: user?.id ?? "",
  });

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