"use server";

import { google } from 'googleapis';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const youtube = google.youtube({
  version: 'v3',
  auth: YOUTUBE_API_KEY,
}) as any;

export interface VideoDetails {
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: Date;
  channelTitle: string;
  channelThumbnail?: string;
  channelSubscribers?: number;
  views: number;
  likes: number;
  comments: number;
  duration: string;
}

export interface ChannelDetails {
  title: string;
  description: string;
  thumbnail: string;
  subscribers: string;
  videos: string;
  publishedAt: string;
}

async function formatDuration(isoDuration: string): Promise<string> {
  const matches = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return '0:00';

  const [_, hours, minutes, seconds] = matches;
  const parts = [];

  if (hours) {
    parts.push(hours);
  }
  parts.push(minutes || '0');
  parts.push(seconds || '0');

  return parts
    .map(part => part.padStart(2, '0'))
    .join(':');
}

export async function getYouTubeVideoId(url: string): Promise<string | null> {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^/?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^/?]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

export async function getVideoMetadata(videoId: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch video metadata");
  }

  const data = await response.json();
  const video = data.items[0];

  return {
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnailUrl: video.snippet.thumbnails.high.url,
    duration: video.contentDetails.duration,
  };
}

export async function getVideoTranscript(videoId: string, language = 'en', userId?: string) {
  if (!userId) {
    throw new Error('Unauthorized: User ID is required to fetch transcript');
  }

  try {
    // First, get the caption tracks for this video
    const captionResponse = await youtube.captions.list({
      part: ['snippet'],
      videoId: videoId
    });

    // Find the caption track in the requested language
    const captionTrack = captionResponse.data.items?.find(
      (item: { snippet: { language: string; }; }) => item.snippet?.language === language
    );

    if (!captionTrack || !captionTrack.id) {
      throw new Error(`No caption track found for language: ${language}`);
    }

    // Download the actual transcript
    const transcript = await youtube.captions.download({
      id: captionTrack.id
    });

    // Process the transcript data
    const transcriptText = transcript.data.toString();
    
    return transcriptText;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch transcript: ${error.message}`);
    } else {
      throw new Error('Failed to fetch transcript: Unknown error');
    }
  }
}

export async function getVideoDetails(videoId: string): Promise<VideoDetails> {
  try {
    // Fetch video details
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics,contentDetails&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    
    console.log("Video data:", data);
    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found');
    }

    const video = data.items[0];
    const channelId = video.snippet.channelId;
    
    // Fetch channel details
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?id=${channelId}&part=snippet,statistics&key=${YOUTUBE_API_KEY}`
    );
    const channelData = await channelResponse.json();
    
    const channelInfo = channelData.items?.[0];

    // Format duration from ISO 8601 duration (PT1H2M10S -> 1:02:10)
    const duration = await formatDuration(video.contentDetails.duration);

    return {
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high?.url,
      publishedAt: new Date(video.snippet.publishedAt),
      channelTitle: video.snippet.channelTitle,
      channelThumbnail: channelInfo?.snippet?.thumbnails?.default?.url,
      channelSubscribers: parseInt(channelInfo?.statistics?.subscriberCount || '0'),
      views: parseInt(video.statistics.viewCount || '0'),
      likes: parseInt(video.statistics.likeCount || '0'),
      comments: parseInt(video.statistics.commentCount || '0'),
      duration: duration
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
}
