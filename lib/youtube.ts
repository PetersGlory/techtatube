const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;

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

export async function getVideoTranscript(videoId: string) {
  // You'll need to implement this using a third-party service
  // or YouTube's captions API (requires OAuth)
  // For now, this is a placeholder
  throw new Error("Not implemented");
} 