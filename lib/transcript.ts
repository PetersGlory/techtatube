"use server"

import { YoutubeTranscript } from 'youtube-transcript';

interface TranscriptPart {
  text: string;
  duration: number;
  offset: number;
}

export async function getTranscript(videoId: string, language = 'en', userId?: string) {
  if (!userId) {
    throw new Error('Unauthorized: User ID is required to fetch transcript');
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId, { lang: language });
    const fullText = transcript.map(part => part.text).join(' ').trim();
    return fullText;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw new Error('Failed to fetch transcript');
  }
} 