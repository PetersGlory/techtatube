import { DatabaseReader, DatabaseWriter } from "./_generated/server";

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