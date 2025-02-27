"use client";

import { Video } from "@/convex/types";
import { Card } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useEffect } from "react";
import { showToast } from "@/lib/toast-utils";

interface VideoMetricsProps {
  videos: Video[];
}

export function VideoMetrics({ videos }: VideoMetricsProps) {
  // Calculate metrics
  const totalVideos = videos.length;
  const completedVideos = videos.filter(v => v.status === "completed").length;
  const processingVideos = videos.filter(v => v.status === "processing").length;
  const failedVideos = videos.filter(v => v.status === "failed").length;

  const chartData = [
    { name: 'Completed', value: completedVideos },
    { name: 'Processing', value: processingVideos },
    { name: 'Failed', value: failedVideos },
  ];

  useEffect(() => {
    if (failedVideos > 0) {
      showToast.error(
        "Failed Videos",
        `${failedVideos} video(s) failed to process. Please try resubmitting them.`
      );
    }
  }, [failedVideos]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Total Videos</h3>
        <p className="text-2xl font-bold">{totalVideos}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
        <p className="text-2xl font-bold text-green-600">{completedVideos}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Processing</h3>
        <p className="text-2xl font-bold text-yellow-600">{processingVideos}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Failed</h3>
        <p className="text-2xl font-bold text-red-600">{failedVideos}</p>
      </Card>

      <Card className="p-4 col-span-full">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Video Status Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
} 