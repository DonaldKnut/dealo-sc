import { connect } from "@/database";
import { UserModel } from "@/models/User"; // Adjust the path according to your project structure
import { NextResponse } from "next/server"; // If using Next.js

// Define the GET handler
export const GET = async (
  req: Request,
  { params }: { params: { query: string } }
): Promise<Response> => {
  try {
    await connect(); // Connect to the database

    const { query } = params; // Destructure query from params

    // Search for users based on username or email
    const searchedContacts = await UserModel.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    return NextResponse.json(searchedContacts, { status: 200 }); // Return JSON response
  } catch (err) {
    console.error(err); // Log the error for debugging
    return new Response("Failed to search contact", { status: 500 }); // Return error response
  }
};
