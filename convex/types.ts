import { DatabaseReader, DatabaseWriter } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export interface ConvexContext {
  db: DatabaseReader | DatabaseWriter;
  auth: {
    userId: string | null;
    isAuthenticated: boolean;
  };
}

export interface User {
  _id: string;
  email: string;
  createdAt: number;
  updatedAt: number;
  usageLimit: number;
  usageCount: number;
  teamId?: string;
}

export interface Team {
  _id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface Content {
  _id: string;
  title: string;
  content: string;
  type: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  teamId?: string;
  isPublished: boolean;
  metadata?: any;
}

export interface Video {
  _id: Id<"videos">;
  _creationTime: number;
  userId: string;
  youtubeUrl: string;
  youtubeId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: number;
  updatedAt: number;
}

export interface Transcript {
  _id: Id<"transcripts">;
  _creationTime: number;
  videoId: Id<"videos">;
  userId: string;
  content: string;
  language: string;
  createdAt: number;
  updatedAt: number;
} 