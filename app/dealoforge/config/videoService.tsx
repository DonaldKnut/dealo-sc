import axios from "axios";

// Define the structure of a video item from the API response
export interface VideoItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
    channelTitle: string;
  };
}

// Define the structure of the API response
interface YouTubeResponse {
  items: VideoItem[];
}

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

// Fetch videos from YouTube API and return the video details with full URLs
const getVideos = async (query: string): Promise<VideoItem[]> => {
  const params = {
    part: "snippet",
    q: query,
    maxResults: 3, // Fetch multiple results in case you want more than one video
    type: "video",
    key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY as string,
  };

  try {
    const response = await axios.get<YouTubeResponse>(YOUTUBE_BASE_URL, {
      params,
    });

    // Map the response to include full video URLs
    const videos = response.data.items.map((item) => ({
      ...item,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`, // Construct full URL
    }));

    return videos.filter((item) => item.id?.videoId); // Ensure only valid videos are returned
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
};

export default getVideos;
