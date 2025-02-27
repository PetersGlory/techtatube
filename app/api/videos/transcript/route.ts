import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { getTranscript } from "@/lib/transcript";
import { analyzeVideoContent } from "@/lib/gemini";
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
    // Check feature access
    const usage = await convex.query(api.usage.getUsage, { userId });
    const hasAccess = usage && usage.current < usage.limit;

    if (!hasAccess) {
      showToast.error("Access Denied", "Please upgrade your plan to process more videos.");
      return new NextResponse("Access Denied", { status: 403 });
    }

    const { videoId, youtubeId } = await req.json();
    showToast.loading("Processing Transcript", "Extracting video transcript...");

    const content = await getTranscript(youtubeId);

    await convex.mutation(api.transcripts.createTranscript, {
      videoId,
      userId,
      content,
      language: 'en',
    });

    // Analyze with Gemini
    const analysis = await analyzeVideoContent(content);
    
    // Save analysis
    await convex.mutation(api.analysis.saveAnalysis, {
      videoId,
      analysis,
    });

    // Increment usage after successful processing
    await convex.mutation(api.usage.incrementUsage, { userId });

    // Update video status
    await convex.mutation(api.videos.updateVideoStatus, {
      videoId,
      status: "completed",
    });

    showToast.success("Transcript Ready", "Video transcript has been processed.");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing video:", error);
    
    // Update video status to failed
    const { videoId } = await req.json();
    await convex.mutation(api.videos.updateVideoStatus, {
      videoId,
      status: "failed",
    });

    showToast.error(
      "Transcript Error",
      "Failed to process video transcript. Please try again."
    );
    return new NextResponse("Failed to fetch transcript", { status: 500 });
  }
} 