import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { getVideoMetadata } from "@/lib/youtube";
import { showToast } from "@/lib/toast-utils";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      showToast.error("Unauthorized", "Please sign in to continue.");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { videoId } = await req.json();
    showToast.loading("Fetching Metadata", "Getting video information...");
    
    const metadata = await getVideoMetadata(videoId);

    await convex.mutation(api.videos.updateVideoMetadata, {
      videoId,
      ...metadata,
    });

    showToast.success("Metadata Updated", "Video information has been updated.");
    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Error fetching video metadata:", error);
    showToast.error(
      "Metadata Error",
      "Failed to fetch video metadata. Please try again."
    );
    return new NextResponse("Failed to fetch video metadata", { status: 500 });
  }
} 