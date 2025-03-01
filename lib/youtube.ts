"use server";

import { google } from 'googleapis';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const youtube = new google.youtube({
  version: 'v3',
  auth: YOUTUBE_API_KEY,
});

export interface VideoDetails {
  title: string;
  views: string; // Changed from string to number for better type accuracy
  thumbnail: string;
  duration: string;
  description: string;
  channel: ChannelDetails;
  comments: string;
  likes: string;
  publishedAt: string;

}

export interface ChannelDetails {
  title: string;
  description: string;
  thumbnail: string;
  subscribers: string;
  videos: string;
  publishedAt: string;
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
      (      item: { snippet: { language: string; }; }) => item.snippet?.language === language
    );

    if (!captionTrack || !captionTrack.id) {
      throw new Error(`No caption track found for language: ${language}`);
    }

    // Download the actual transcript
    const transcript = await youtube.captions.download({
      id: captionTrack.id
    });

    // Process the transcript data
    // Note: The actual processing depends on the format returned by the API
    // This is a simplified example
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

export async function getVideoDetails(videoId: string) {

  try {   
    const response = await youtube.videos.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      id: [videoId],
    });
    console.log("video-Info: ", response.data);
    const videoDetails = response.data.items?.[0];

    if(!videoDetails) throw new Error("Video not found");

    // return videoDetails;
    const channelResponse = await youtube.channels.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      id: [videoDetails?.snippet?.channelId],
    });
    const channelDetails = channelResponse.data.items?.[0];
    console.log("channel-Info: ", channelResponse.data);


    const videoInfo: VideoDetails = {
      title: videoDetails?.snippet?.title || '',
      thumbnail: videoDetails?.snippet?.thumbnails?.high?.url || videoDetails?.snippet?.thumbnails?.default?.url || videoDetails?.snippet?.thumbnails?.maxres?.url || '',
      duration: videoDetails?.contentDetails?.duration || '',
      description: videoDetails?.snippet?.description || '',
      publishedAt: videoDetails?.snippet?.publishedAt || new Date().toISOString(),
      channel: {
        title: channelDetails?.snippet?.title || '',
        description: channelDetails?.snippet?.description || '',
        thumbnail: channelDetails?.snippet?.thumbnails?.high?.url || channelDetails?.snippet?.thumbnails?.default?.url || channelDetails?.snippet?.thumbnails?.maxres?.url || '',
        subscribers: channelDetails?.statistics?.subscriberCount || '',
        videos: channelDetails?.statistics?.videoCount || '',
        publishedAt: channelDetails?.snippet?.publishedAt || new Date().toISOString(),
      },
      views: videoDetails?.statistics?.viewCount || '',
      comments: videoDetails?.statistics?.commentCount || '',
      likes: videoDetails?.statistics?.likeCount || '',
    }
    return videoInfo;
} catch (error) {
  console.error("Error fetching video details:", error);
  return null;
}
}


