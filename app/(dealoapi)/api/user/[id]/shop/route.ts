import Work from "@/models/Work"; // Import the Work model
import { UserModel } from "@/models/User"; // Import the User model
import { NextResponse } from "next/server"; // Next.js Response
import { connect } from "@/database"; // Connect to the database

// Define the GET handler
export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> => {
  try {
    console.log("Connecting to database...");
    await connect();

    console.log("Fetching user with ID:", params.id);
    const user = await UserModel.findById(params.id);

    if (!user) {
      console.error(`User with ID ${params.id} not found.`);
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    console.log("Fetching works for user...");
    const workList = await Work.find({ creator: params.id }).populate(
      "creator"
    );

    console.log("Works fetched successfully.");
    return NextResponse.json({ user, workList }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching works for user:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch work list by user",
        details: err.message,
      }),
      { status: 500 }
    );
  }
};
