import { connect } from "@/database";
import { UserModel } from "@/models/User"; // Adjust the path according to your project structure
import { NextResponse } from "next/server"; // If using Next.js

// Define the POST handler
export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
): Promise<Response> => {
  try {
    await connect(); // Connect to the database

    const { userId } = params; // Destructure userId from params

    const body = await req.json(); // Parse JSON body from request

    const { username, profileImage } = body; // Destructure username and profileImage from body

    // Update the user in the database
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        username,
        profileImage,
      },
      { new: true } // Return the updated document
    );

    return NextResponse.json(updatedUser, { status: 200 }); // Return JSON response
  } catch (err) {
    console.error(err); // Log the error for debugging
    return new Response("Failed to update user", { status: 500 }); // Return error response
  }
};
