import axios from "axios";

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

// Define the type for the video item structure from the YouTube API response
interface VideoItem {
  id: {
    videoId: string;
  };
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

// Function to fetch videos from YouTube API
const getVideos = async (query: string): Promise<VideoItem[]> => {
  const params = {
    part: "snippet",
    q: query,
    maxResults: 1,
    key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY as string,
  };

  try {
    const response = await axios.get<YouTubeResponse>(YOUTUBE_BASE_URL, {
      params,
    });
    return response.data.items;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
};

// Export it as default
export default getVideos;
