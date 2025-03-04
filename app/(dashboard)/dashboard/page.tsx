/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
// import { motion } from "framer-motion";
import { ContentForm } from "@/components/content-form"
import { BarChart, FileText, Users, ArrowUpRight, Search, Filter, Edit2, Trash2, Youtube, Sparkles, TrendingUp, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { FeatureGate } from "@/components/feature-gate";
// import { useAnalytics } from "@/hooks/use-analytics";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
// import { routes } from "@/lib/navigation";
import { formatDistanceToNow } from "date-fns";
import { Video } from "@/convex/types";
import { Badge } from "@/components/ui/badge";
import { YoutubeForm } from "@/components/youtube-form";
import ToastHandler from "@/components/ToastHandler";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const content = useQuery(api.content.getContentByUser, { 
    userId: user?.id ?? "" 
  });
  const analytics = useQuery(api.content.getAnalytics, { 
    userId: user?.id ?? "" 
  });
  const createContent = useMutation(api.content.createContent);
  const deleteContent = useMutation(api.content.deleteContent);
  const updateContent = useMutation(api.content.updateContent);
  const userPlan = useQuery(api.users.getUser, { userId: user?.id ?? "" });
  const { showToast } = ToastHandler();
  const router = useRouter();
  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [contentType, setContentType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Filter and sort content
  const filteredContent = content?.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (contentType === "all" || item.type === contentType)
  ).sort((a, b) => {
    if (sortBy === "newest") return b.createdAt - a.createdAt;
    if (sortBy === "oldest") return a.createdAt - b.createdAt;
    if (sortBy === "views") {
      const aViews = analytics?.find(an => an.contentId === a._id)?.views ?? 0;
      const bViews = analytics?.find(an => an.contentId === b._id)?.views ?? 0;
      return bViews - aViews;
    }
    return 0;
  });

  // Analytics data for chart
  const chartData = analytics?.map(item => ({
    date: new Date(item.createdAt).toLocaleDateString(),
    views: item.views,
    engagement: item.engagement
  }));

  const videos = useQuery(api.videos.getUserVideos, {
    userId: user?.id ?? "skip",
  }) as Video[] | undefined;

  const usage = useQuery(api.usage.getUsage, {
    userId: user?.id ?? "skip",
  });

  if (!isLoaded) {
    return <LoadingSkeleton />;
  }

  const recentVideos = videos?.slice(0, 3) ?? [];
  const completedVideos = videos?.filter(v => v.status === "completed") ?? [];
  const processingVideos = videos?.filter(v => v.status === "processing") ?? [];

  // useAnalytics(); // Track user analytics

  const stats = {
    total: videos?.length ?? 0,
    processing: videos?.filter(v => v.status === "processing").length ?? 0,
    completed: videos?.filter(v => v.status === "completed").length ?? 0,
    failed: videos?.filter(v => v.status === "failed").length ?? 0,
  };

  // const handleSelectPlan = async (plan: string) => {
  //   try {
  //     await updateUserPlan({
  //       userId: user?.id ?? "",
  //       plan: plan,
  //     });
  //     showToast("success", `You have selected the ${plan} plan.`);
  //   } catch (error) {
  //     showToast("error", "Failed to update your plan.");
  //   }
  // };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Upload and analyze your YouTube videos
          </p>
        </div>
        
        {usage && (
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Monthly Usage
              </div>
              <Badge variant="secondary">
                {usage.current} / {usage.limit}
              </Badge>
            </div>
          </Card>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Videos"
          value={stats.total}
          icon={<Youtube className="w-4 h-4" />}
        />
        <StatsCard
          title="Processing"
          value={stats.processing}
          icon={<Clock className="w-4 h-4" />}
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatsCard
          title="Failed"
          value={stats.failed}
          icon={<ExternalLink className="w-4 h-4" />}
        />
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Upload New Video</h2>
          <p className="text-sm text-muted-foreground">
            Enter a YouTube URL to start analyzing
          </p>
        </div>
        <YoutubeForm />
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Videos</h2>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {recentVideos.map((video) => (
            <Card key={video._id} className="p-4">
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
                    <div>
                      <h3 className="font-semibold">{video.title || "Untitled"}</h3>
                      <p className="text-sm text-muted-foreground">
                        Processed {formatDistanceToNow(video.createdAt)} ago
                      </p>
                    </div>
                    <Badge variant={
                      video.status === "completed" ? "success" :
                      video.status === "failed" ? "destructive" :
                      "secondary"
                    }>
                      {video.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    {video.status === "completed" && (
                      <Link href={`/videos/${video._id}`}>
                        <Button variant="default" size="sm" className="gap-2">
                          <FileText className="w-4 h-4" />
                          View Analysis
                        </Button>
                      </Link>
                    )}
                    {video.youtubeUrl && (
                      <Link href={video.youtubeUrl} target="_blank">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Youtube className="w-4 h-4" />
                          Watch on YouTube
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/40 p-6 rounded-xl border border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Content</p>
              <h3 className="text-2xl font-bold">{content?.length ?? 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-black/40 p-6 rounded-xl border border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Views</p>
              <h3 className="text-2xl font-bold">
                {analytics?.reduce((sum, a) => sum + a.views, 0) ?? 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-black/40 p-6 rounded-xl border border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <BarChart className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Engagement Rate</p>
              <h3 className="text-2xl font-bold">
                {analytics?.reduce((sum, a) => sum + a.engagement, 0) ?? 0}%
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <FeatureGate feature="pro">
        <div className="bg-black/40 rounded-xl border border-white/5 p-6">
          <h2 className="text-xl font-bold mb-6">Performance Overview</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111827',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#colorEngagement)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FeatureGate>

      {/* Content Generator */}
      <div className="bg-black/40 rounded-xl border border-white/5 p-6">
        <h2 className="text-xl font-bold mb-4">Generate New Content</h2>
        <ContentForm />
      </div>

      {/* Content Management */}
      <div className="bg-black/40 rounded-xl border border-white/5 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Content Management</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search content..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="article">Articles</SelectItem>
                <SelectItem value="social">Social Posts</SelectItem>
                <SelectItem value="video">Video Scripts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredContent?.map((item) => (
            <div 
              key={item._id} 
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-400">{item.type}</span>
                  <span className="text-sm text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-400">
                    {analytics?.find(a => a.contentId === item._id)?.views ?? 0} views
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push(`/content/${item._id}`)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deleteContent({ id: item._id })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2>Your Current Plan: {userPlan ? userPlan.plan : 'No plan selected'}</h2>
      </div>
    </div>
  )
}

function StatsCard({ 
  title, 
  value, 
  icon, 
}: { 
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-2 bg-primary/10 rounded-full">
          {icon}
        </div>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-96 mb-6" />
        <Skeleton className="h-10 w-full" />
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>

        <div className="grid gap-4">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex gap-4">
                <Skeleton className="w-40 h-24" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-64 mb-2" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
