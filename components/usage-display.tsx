"use client";

import { useUsage } from "@/hooks/use-usage";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

export function UsageDisplay() {
  const { usage, hasReachedLimit, remainingUsage } = useUsage();

  if (!usage) return null;

  const percentage = (usage.current / usage.limit) * 100;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Usage</h3>
      <Progress value={percentage} className="mb-2" />
      <div className="flex justify-between text-sm text-gray-500">
        <span>{usage.current} used</span>
        <span>{remainingUsage} remaining</span>
      </div>
      {hasReachedLimit && (
        <p className="text-red-500 mt-2 text-sm">
          You&lsquo;ve reached your usage limit. Please upgrade your plan for more.
        </p>
      )}
    </Card>
  );
} 