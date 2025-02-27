import { YoutubeTranscript } from 'youtube-transcript-api';

interface TranscriptPart {
  text: string;
  duration: number;
  offset: number;
}

export async function getTranscript(videoId: string, language = 'en') {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: language,
    });

    // Combine all transcript parts into one text
    const fullText = transcript
      .map((part: TranscriptPart) => part.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    return fullText;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw new Error('Failed to fetch transcript');
  }
} 