"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { YoutubeForm } from "@/components/youtube-form";
import { VideoList } from "@/components/video-list";
import { Card } from "@/components/ui/card";
import { Video } from "@/convex/types";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Youtube, 
  Clock, 
  CheckCircle, 
  XCircle,
  Filter,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function VideosPage() {
  const { user, isLoaded } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const videos = useQuery(api.videos.getUserVideos, {
    userId: user?.id ?? "skip",
  });

  if (!isLoaded || !videos) return <LoadingSkeleton />;

  const filteredVideos = videos?.filter(video => {
    const matchesSearch = video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const matchesStatus = statusFilter === "all" || video.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: videos?.length ?? 0,
    processing: videos?.filter(v => v.status === "processing").length ?? 0,
    completed: videos?.filter(v => v.status === "completed").length ?? 0,
    failed: videos?.filter(v => v.status === "failed").length ?? 0,
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Video Analysis</h1>
        <p className="text-muted-foreground">
          Enter a YouTube URL to analyze the video content
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Videos"
          value={stats.total}
          icon={<Youtube className="h-4 w-4" />}
          className="bg-blue-500/10 text-blue-500"
        />
        <StatsCard
          title="Processing"
          value={stats.processing}
          icon={<Clock className="h-4 w-4" />}
          className="bg-yellow-500/10 text-yellow-500"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle className="h-4 w-4" />}
          className="bg-green-500/10 text-green-500"
        />
        <StatsCard
          title="Failed"
          value={stats.failed}
          icon={<XCircle className="h-4 w-4" />}
          className="bg-red-500/10 text-red-500"
        />
      </div>

      {/* Upload Form */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Process New Video</h2>
        <YoutubeForm />
      </Card>

      {/* Video List */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <h2 className="text-lg font-semibold">Your Videos</h2>
          <div className="flex flex-1 sm:flex-none items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <VideoList videos={filteredVideos as Video[]} />
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
  value: number;
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
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-32 w-full" />
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </Card>
    </div>
  );
}