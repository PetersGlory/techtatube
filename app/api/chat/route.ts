import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import { NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using Gemini 1.5 Flash - the latest model after Pro Vision deprecation

// Deepseek API configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1";

export async function POST(req: Request) {
  try {
    const { message, videoId, context } = await req.json();
    const { transcript, analysis } = context;

    // Prepare context for the AI
    const systemContext = `You are an AI assistant analyzing a YouTube video. 
    Here's the video transcript: ${transcript}
    
    Analysis of the video:
    - Summary: ${analysis?.summary || "Not available"}
    - Key Points: ${analysis?.keyPoints?.join(", ") || "Not available"}
    - Sentiment: ${analysis?.sentiment || "Not available"}
    - Content Rating: ${analysis?.contentRating || "Not available"}
    
    Please provide detailed, accurate responses based on this context.`;

    // Check if the message is requesting image or title generation
    const isImageRequest = /\b(generate|create)\s+thumbnail\s+image\b/i.test(message);
    const isTitleRequest = /\b(generate|create)\s+title\b/i.test(message);

    if (isImageRequest) {
      // Handle image generation with Deepseek
      const imagePrompt = `Create a YouTube thumbnail based on this context: ${analysis?.summary}. 
      Make it engaging and professional.`;
      
      const response = await axios.post(`${DEEPSEEK_API_URL}/images/generations`, {
        prompt: imagePrompt,
        n: 1,
        size: "1280x720",
        quality: "hd",
        response_format: "url"
      }, {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const imageUrl = response.data.data[0].url;

      return NextResponse.json({ 
        response: "I've generated a new thumbnail for your video. You can find it here: " + imageUrl,
        imageUrl: imageUrl
      });
    }

    if (isTitleRequest) {
      // Handle title generation with Deepseek
      const titlePrompt = `Based on this video content: ${analysis?.summary}
      Generate 3 engaging, SEO-optimized YouTube titles.`;
      
      const response = await axios.post(`${DEEPSEEK_API_URL}/chat/completions`, {
        model: 'deepseek-chat',
        messages: [
          { 
            role: 'system', 
            content: 'You are a YouTube title optimization expert. Generate engaging, SEO-friendly titles.' 
          },
          { 
            role: 'user', 
            content: titlePrompt 
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const titles = response.data.choices[0].message.content;

      return NextResponse.json({ 
        response: "Here are some title suggestions:\n\n" + titles
      });
    }

    // Regular chat response using Gemini
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(systemContext + "\n\nUser: " + message);
    const response = result.response.text();

    return NextResponse.json({ response });

  } catch (error) {
    console.error("Chat API error:", error);
    if (axios.isAxiosError(error)) {
      console.error("Deepseek API error:", error.response?.data);
    }
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
} 