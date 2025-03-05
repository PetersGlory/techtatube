"use server"

import { YoutubeTranscript } from 'youtube-transcript';

interface TranscriptPart {
  text: string;
  duration: number;
  offset: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // Increased to 2 seconds
const FETCH_TIMEOUT = 30000; // Increased to 30 seconds

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getTranscript(youtubeIdOrUrl: string): Promise<string> {
  let attempts = 0;
  let lastError: Error | null = null;

  while (attempts < MAX_RETRIES) {
    try {
      console.log(`Attempt ${attempts + 1} of ${MAX_RETRIES} to fetch transcript for:`, youtubeIdOrUrl);
      
      // Check if input is a URL or an ID
      let youtubeId = youtubeIdOrUrl;
      
      // If it's a URL, try to extract the ID
      if (youtubeIdOrUrl.includes('youtube.com') || youtubeIdOrUrl.includes('youtu.be')) {
        try {
          // Extract ID from URL using a more robust method
          const urlObj = new URL(youtubeIdOrUrl);
          
          if (youtubeIdOrUrl.includes('youtube.com')) {
            youtubeId = urlObj.searchParams.get('v') || '';
          } else if (youtubeIdOrUrl.includes('youtu.be')) {
            youtubeId = urlObj.pathname.substring(1);
          }
          
          console.log("Extracted ID from URL:", youtubeId);
        } catch (urlError) {
          console.error("Error parsing YouTube URL:", urlError);
          throw new Error("Invalid YouTube URL format");
        }
      }
      
      // Ensure we have a valid ID
      if (!youtubeId || youtubeId.length !== 11) {
        throw new Error("Invalid YouTube ID format - must be 11 characters");
      }
      
      // Get transcript with timeout and error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

      try {
        const transcriptResponse = await Promise.race([
          YoutubeTranscript.fetchTranscript(youtubeId),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`Transcript fetch timeout after ${FETCH_TIMEOUT/1000} seconds`)), FETCH_TIMEOUT)
          )
        ]) as Array<{ text: string }>;

        clearTimeout(timeoutId);
        
        // Format transcript
        const formattedTranscript = transcriptResponse
          .map((item) => item.text.trim())
          .filter(text => text.length > 0) // Remove empty segments
          .join(" ");
        
        if (!formattedTranscript.trim()) {
          throw new Error("Empty transcript received");
        }
        
        return formattedTranscript;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error(`Transcript fetch aborted after ${FETCH_TIMEOUT/1000} seconds`);
        }
        throw fetchError;
      }
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Attempt ${attempts + 1} failed:`, lastError);
      
      // Check if we should retry
      if (attempts < MAX_RETRIES - 1) {
        const delay = RETRY_DELAY * Math.pow(2, attempts); // Exponential backoff
        console.log(`Waiting ${delay/1000} seconds before retry...`);
        await sleep(delay);
        attempts++;
      } else {
        console.error("All retry attempts failed");
        throw new Error(`Failed to fetch transcript after ${MAX_RETRIES} attempts: ${lastError.message}`);
      }
    }
  }
  
  throw lastError || new Error("Unknown error fetching transcript");
} 