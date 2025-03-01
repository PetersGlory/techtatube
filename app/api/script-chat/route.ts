import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message, contentId, context } = await req.json();

    // Get the generative model (Gemini)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create a chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: "You are an AI assistant helping with a YouTube script. Answer questions about the script content, provide suggestions for improvements, and help with any script-related queries. Be concise, helpful, and creative."
            }
          ]
        },
        {
          role: "model",
          parts: [
            {
              text: "I'll help you with your YouTube script. I can provide feedback, suggestions for improvements, answer questions about the content, and assist with any script-related queries. I'll be concise, helpful, and creative in my responses. What would you like to know about your script?"
            }
          ]
        },
        {
          role: "user",
          parts: [
            {
              text: `Here is the script content for reference:\n${context.scriptContent}`
            }
          ]
        },
        {
          role: "model",
          parts: [
            {
              text: "I've reviewed the script content you provided. I'm ready to answer any questions or provide feedback about it. What specific aspects would you like me to help with?"
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
    console.error("Script chat error:", error);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
} 