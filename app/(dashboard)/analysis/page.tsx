"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoMetrics } from "@/components/video-metrics";
import { VideoAnalysisList } from "@/components/video-analysis-list";
import { Video } from "@/convex/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalysisPage() {
  const { user, isLoaded } = useUser();
  const videos = useQuery(api.videos.getUserVideos, { 
    userId: user?.id ?? "skip"
  }) as Video[] | undefined;

  if (!isLoaded) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Video Analysis</h1>
          <p className="text-muted-foreground">
            View detailed analytics and insights for your videos.
          </p>
        </div>

        <Tabs defaultValue="metrics" className="space-y-4">
          <TabsList>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4">
            <VideoMetrics videos={videos ?? []} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <VideoAnalysisList videos={videos ?? []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}