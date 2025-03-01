"use server"

import { YoutubeTranscript } from 'youtube-transcript';

interface TranscriptPart {
  text: string;
  duration: number;
  offset: number;
}

export async function getTranscript(youtubeIdOrUrl: string): Promise<string> {
  try {
    console.log("Fetching transcript for:", youtubeIdOrUrl);
    
    // Check if input is a URL or an ID
    let youtubeId = youtubeIdOrUrl;
    
    // If it's a URL, try to extract the ID
    if (youtubeIdOrUrl.includes('youtube.com') || youtubeIdOrUrl.includes('youtu.be')) {
      // Extract ID from URL using a more robust method
      const urlObj = new URL(youtubeIdOrUrl);
      
      if (youtubeIdOrUrl.includes('youtube.com')) {
        youtubeId = urlObj.searchParams.get('v') || '';
      } else if (youtubeIdOrUrl.includes('youtu.be')) {
        youtubeId = urlObj.pathname.substring(1);
      }
      
      console.log("Extracted ID from URL:", youtubeId);
    }
    
    // Ensure we have a valid ID
    if (!youtubeId || youtubeId.length !== 11) {
      throw new Error("Invalid YouTube ID");
    }
    
    // Get transcript
    const transcriptResponse = await YoutubeTranscript.fetchTranscript(youtubeId);
    
    // Format transcript
    const formattedTranscript = transcriptResponse
      .map((item) => item.text)
      .join(" ");
    
    return formattedTranscript;
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw error;
  }
} 