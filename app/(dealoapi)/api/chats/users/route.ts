import { UserModel } from "@/models/User"; // Adjust the path according to your project structure
import { connect } from "@/database";
import { NextResponse } from "next/server"; // If you're using Next.js

// Define the GET handler
export const GET = async (req: Request): Promise<Response> => {
  try {
    await connect(); // Connect to the database

    const allUsers = await UserModel.find(); // Fetch all users

    return NextResponse.json(allUsers, { status: 200 }); // Return JSON response
  } catch (err) {
    console.error(err); // Log the error
    return new Response("Failed to get all users", { status: 500 }); // Return error response
  }
};
