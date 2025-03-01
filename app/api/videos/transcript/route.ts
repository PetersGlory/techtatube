"use server";

import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { getTranscript } from "@/lib/transcript";
import { Id } from "@/convex/_generated/dataModel";
import { auth } from "@clerk/nextjs";
import { analyzeVideo } from "@/lib/analysis";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// export const runtime = 'edge';

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { videoId, youtubeId, youtubeUrl } = await req.json();
    
    // Debug logging
    console.log("Received request with:", { videoId, youtubeId, youtubeUrl });
    
    // Try to get transcript directly from the URL instead of ID
    let transcript;
    try {
      // First try with the ID
      transcript = await getTranscript(youtubeId);
    } catch (error) {
      console.error("Error fetching transcript with ID:", error);
      
      // If that fails, try with the full URL
      try {
        transcript = await getTranscript(youtubeUrl);
      } catch (urlError) {
        console.error("Error fetching transcript with URL:", urlError);
        throw new Error("Failed to fetch transcript");
      }
    }
    
    // Save transcript to database
    await convex.mutation(api.transcripts.createTranscript, {
      videoId: videoId as Id<"videos">,
      content: transcript,
      userId: userId as Id<"users">,
      language: "en",
    });
    
    // Update video status
    await convex.mutation(api.videos.updateVideoStatus, {
      videoId: videoId as Id<"videos">,
      status: "processing",
    });
    
    // Start analysis in the background
    analyzeVideo(videoId, transcript, userId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing transcript:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 