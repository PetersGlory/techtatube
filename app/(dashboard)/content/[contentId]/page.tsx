"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { getScriptTitle, parseScriptContent } from "@/lib/utils";

export default function ViewContentPage() {
  const { contentId } = useParams();
  const content = useQuery(api.content.getContentById, { contentId: contentId as Id<"content"> });

  if (!content) return <Skeleton className="h-48 w-full" />;
    const mainScript = parseScriptContent(content.content);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{getScriptTitle(content.content, content.title) || content.title}</h1>
      <Card className="mt-4 p-4">
        {mainScript && mainScript.map((section, index) => (
            <Card key={index} className="p-4 bg-white/5">
              <h2 className="font-bold text-lg text-blue-700">{section.name}</h2>
              <div className="mt-2">
                <h3 className="text-sm font-semibold text-gray-600">Visual:</h3>
                <p className="text-sm mb-2 italic">{section.visual}</p>
                <h3 className="text-sm font-semibold text-gray-600">Narration:</h3>
                <p className="text-sm">{section.narration}</p>
              </div>
            </Card>
          ))}
      </Card>
    </div>
  );
} 