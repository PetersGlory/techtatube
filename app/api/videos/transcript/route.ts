import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { getTranscript } from "@/lib/transcript";
import { analyzeVideoContent } from "@/lib/gemini";
import { showToast } from "@/lib/toast-utils";
import { Id } from "@/convex/_generated/dataModel";
import { auth } from "@clerk/nextjs/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const runtime = 'edge';

export async function POST(req: Request) {
  let videoId: Id<"videos"> | undefined;
  try {
    const { userId } = auth();
    if (!userId) {
      showToast.error("Unauthorized", "Please sign in to continue.");
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Check feature access
    const usage = await convex.query(api.usage.getUsage, { userId });
    const hasAccess = usage && usage.current < usage.limit;

    if (!hasAccess) {
      showToast.error("Access Denied", "Please upgrade your plan to process more videos.");
      return new NextResponse("Access Denied", { status: 403 });
    }

    const body = await req.json();
    videoId = body.videoId;
    const { youtubeId } = body;

    showToast.loading("Processing Transcript", "Extracting video transcript...");

    const content = await getTranscript(youtubeId);
    if (!content) {
      throw new Error("Failed to get transcript");
    }

    await convex.mutation(api.videos.updateVideoStatus, {
      videoId: videoId as Id<"videos">,
      status: "processing",
    });

    await convex.mutation(api.transcripts.createTranscript, {
      videoId: videoId as Id<"videos">,
      userId,
      content,
      language: 'en',
    });

    // Analyze with Gemini
    const analysis = await analyzeVideoContent(content);
    if (!analysis) {
      throw new Error("Failed to analyze content");
    }
    
    // Save analysis
    await convex.mutation(api.analysis.saveAnalysis, {
      videoId: videoId as Id<"videos">,
      analysis,
    });

    // Increment usage after successful processing
    await convex.mutation(api.usage.incrementUsage, { userId });

    // Update video status
    await convex.mutation(api.videos.updateVideoStatus, {
      videoId: videoId as Id<"videos">,
      status: "completed",
    });

    showToast.success("Transcript Ready", "Video transcript has been processed.");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing video:", error);
    
    if (videoId) {
      await convex.mutation(api.videos.updateVideoStatus, {
        videoId: videoId as Id<"videos">,
        status: "failed",
      });
    }

    showToast.error(
      "Transcript Error",
      "Failed to process video transcript. Please try again."
    );
    return new NextResponse("Failed to process video", { status: 500 });
  }
} 