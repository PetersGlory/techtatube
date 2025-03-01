import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message, videoId, context } = await req.json();
    
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create a chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: "You are an AI assistant helping with YouTube video content. Answer questions about the video transcript, provide insights about the content, and help with any video-related queries. Be concise, helpful, and creative."
            }
          ]
        },
        {
          role: "model",
          parts: [
            {
              text: "I'll help you with your YouTube video content. I can provide insights, answer questions about the transcript, and assist with any video-related queries. I'll be concise, helpful, and creative in my responses."
            }
          ]
        },
        {
          role: "user",
          parts: [
            {
              text: `Here is the video transcript for reference:\n${context.transcript || "No transcript available."}\n\nHere is the analysis of the video:\n${
                context.analysis 
                  ? `Summary: ${context.analysis.summary}\nKey Points: ${context.analysis.keyPoints.join(", ")}\nSentiment: ${context.analysis.sentiment}\nContent Rating: ${context.analysis.contentRating}`
                  : "No analysis available."
              }`
            }
          ]
        },
        {
          role: "model",
          parts: [
            {
              text: "I've reviewed the transcript and analysis you provided. I'm ready to answer any questions or provide insights about this video content. What would you like to know?"
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    // Send the user's message and get a response
    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({
      response: response,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
} 