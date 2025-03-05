import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    // Check if we can connect to Convex
    const isConvexConnected = !!process.env.NEXT_PUBLIC_CONVEX_URL;
    
    // Check if Gemini API key is configured
    const isGeminiConfigured = !!process.env.GEMINI_API_KEY;
    
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        convex: isConvexConnected ? "connected" : "not_configured",
        gemini: isGeminiConfigured ? "configured" : "not_configured"
      }
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 