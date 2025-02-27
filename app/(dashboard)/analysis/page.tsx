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
import { 
  BarChart2, 
  Sparkles, 
  Brain,
  MessageSquare,
  TrendingUp,
  Tag,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AnalysisPage() {
  const { user, isLoaded } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  
  const videos = useQuery(api.videos.getUserVideos, { 
    userId: user?.id ?? "skip"
  }) as Video[] | undefined;

  const analyses = useQuery(api.analysis.getVideoAnalyses, { 
    userId: user?.id ?? "skip" 
  });

  if (!isLoaded) {
    return <LoadingSkeleton />;
  }

  const filteredVideos = videos?.filter(video => 
    video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );
  const stats = {
    totalAnalyses: analyses?.length ?? 0,
    avgSentiment: "Positive", // You can calculate this from your analyses
    keyPointsGenerated: analyses?.reduce((acc: number, a: { keyPoints?: any[] }) => acc + (a.keyPoints?.length ?? 0), 0) ?? 0,
    tagsGenerated: analyses?.reduce((acc: number, a: { suggestedTags?: any[] }) => acc + (a.suggestedTags?.length ?? 0), 0) ?? 0,
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Video Analysis</h1>
        <p className="text-muted-foreground">
          AI-powered insights and analytics for your video content
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Analyses"
          value={stats.totalAnalyses}
          icon={<Brain className="h-4 w-4" />}
          className="bg-purple-500/10 text-purple-500"
        />
        <StatsCard
          title="Avg. Sentiment"
          value={stats.avgSentiment}
          icon={<MessageSquare className="h-4 w-4" />}
          className="bg-blue-500/10 text-blue-500"
        />
        <StatsCard
          title="Key Points"
          value={stats.keyPointsGenerated}
          icon={<Sparkles className="h-4 w-4" />}
          className="bg-yellow-500/10 text-yellow-500"
        />
        <StatsCard
          title="Tags Generated"
          value={stats.tagsGenerated}
          icon={<Tag className="h-4 w-4" />}
          className="bg-green-500/10 text-green-500"
        />
      </div>

      {/* Main Content */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <h2 className="text-lg font-semibold">Content Analysis</h2>
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="metrics">
              <BarChart2 className="h-4 w-4 mr-2" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="insights">
              <TrendingUp className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4">
            <VideoMetrics videos={filteredVideos ?? []} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <VideoAnalysisList videos={filteredVideos ?? []} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

function StatsCard({ 
  title, 
  value, 
  icon, 
  className 
}: { 
  title: string;
  value: number | string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-lg ${className}`}>
          {icon}
        </div>
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-8 w-24 mb-4" />
            <Skeleton className="h-6 w-16" />
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-64" />
        </div>
        
        <Skeleton className="h-10 w-[400px] mb-6" />
        
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </Card>
    </div>
  );
}