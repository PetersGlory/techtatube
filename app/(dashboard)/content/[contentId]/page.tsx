"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";

export default function ViewContentPage() {
  const { contentId } = useParams();
  const content = useQuery(api.content.getContentById, { contentId: contentId as Id<"content"> });

  if (!content) return <Skeleton className="h-48 w-full" />;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{content.title}</h1>
      <Card className="mt-4 p-4">
        <p>{content.content}</p>
      </Card>
    </div>
  );
} 