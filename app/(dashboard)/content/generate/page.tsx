"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Search, Trash2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function GenerateContentPage() {
  const { user, isLoaded } = useUser();
  const content = useQuery(api.content.getContentByUser, { 
    userId: user?.id ?? "" 
  });
  const analytics = useQuery(api.content.getAnalytics, { 
    userId: user?.id ?? "" 
  });

  
  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const deleteContent = useMutation(api.content.deleteContent);
  const [contentType, setContentType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const router = useRouter();

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Generate Content</h1>
      <h2 className="text-xl font-semibold mt-4">History</h2>
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
    </div>
  );
} 