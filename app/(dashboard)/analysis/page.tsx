"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoMetrics } from "@/components/video-metrics";
import { VideoAnalysisList } from "@/components/video-analysis-list";

export default function AnalysisPage() {
  const { user } = useUser();
  const videos = useQuery(api.videos.getUserVideos, { 
    userId: user?.id ?? "" 
  });

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