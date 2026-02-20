import { NextRequest, NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

export const dynamic = "force-dynamic";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const API_SECRET = process.env.NEXT_PUBLIC_STREAM_SECRET_KEY;

if (!API_KEY || !API_SECRET) {
  throw new Error("Stream API key and secret must be provided");
}

const streamClient = new StreamChat(API_KEY, API_SECRET);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "dev-user";

    const token = streamClient.createToken(userId);

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating Stream token:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
