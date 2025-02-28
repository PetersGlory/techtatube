/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollText, MessageSquare, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import Link from "next/link";
import { routes } from "@/lib/navigation";

export default function HistoryPage() {
  const { user, isLoaded } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const videos = useQuery(api.videos.getUserVideos, {
    userId: user?.id ?? "skip",
  });

  if (!isLoaded) {
    return <LoadingSkeleton />;
  }

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Processing History</h1>
        <p className="text-muted-foreground">
          View all your processed videos and their analyses
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Videos" value={stats.total} status="all" />
        <StatsCard title="Processing" value={stats.processing} status="processing" />
        <StatsCard title="Completed" value={stats.completed} status="completed" />
        <StatsCard title="Failed" value={stats.failed} status="failed" />
      </div>

      <div className="space-y-6">
        {filteredVideos?.map((video) => (
          <Card key={video._id} className="p-6 hover:bg-muted/50 transition-colors">
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
                  <Link href={`/videos/${video._id}`}>
                    <h3 className="font-semibold hover:text-primary">{video.title}</h3>
                  </Link>
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

function StatsCard({ title, value, status }: { title: string; value: number; status: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <Badge variant={status === "completed" ? "success" : "secondary"}>{value}</Badge>
        <span className="text-sm font-medium">{title}</span>
      </div>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="flex gap-4 items-center">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-32" />
          </Card>
        ))}
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