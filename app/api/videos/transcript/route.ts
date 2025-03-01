"use server";

import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
// import { api } from "@/convex/_generated/api";
import { getTranscript } from "@/lib/transcript";
// import { analyzeVideoContent } from "@/lib/gemini";
// import { showToast } from "@/lib/toast-utils";
// import { Id } from "@/convex/_generated/dataModel";
// import { getVideoDetails } from "@/lib/youtube";
import { auth } from "@clerk/nextjs";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// export const runtime = 'edge';

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { videoId, language } = await req.json();

  try {
    const transcript = await getTranscript(videoId, language, userId);
    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return new NextResponse("Failed to fetch transcript", { status: 500 });
  }
} 