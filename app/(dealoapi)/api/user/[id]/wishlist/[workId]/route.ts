import IWork from "@/models/Work"; // Adjust the path according to your project structure
import { UserModel } from "@/models/User"; // Adjust the path according to your project structure
import { NextResponse } from "next/server"; // If using Next.js
import { connect } from "@/database";

// Define the PATCH handler
export const PATCH = async (
  req: Request,
  { params }: { params: { id: string; workId: string } }
): Promise<Response> => {
  try {
    await connect(); // Connect to the database

    const userId = params.id; // Extract userId from params
    const workId = params.workId; // Extract workId from params

    const user = await UserModel.findById(userId); // Find the user by ID
    const work = await IWork.findById(workId).populate("creator"); // Find the work by ID and populate creator

    if (!user || !work) {
      return new Response("User or Work not found", { status: 404 }); // Handle case where user or work is not found
    }

    const favoriteWork = user.wishlist.find(
      (item: any) => item._id.toString() === workId
    ); // Check if work is already in wishlist

    if (favoriteWork) {
      // If work is already in wishlist, remove it
      user.wishlist = user.wishlist.filter(
        (item: any) => item._id.toString() !== workId
      );
      await user.save(); // Save updated user
      return new Response(
        JSON.stringify({
          message: "Work removed from wishlist",
          wishlist: user.wishlist,
        }),
        { status: 200 }
      );
    } else {
      // If work is not in wishlist, add it
      user.wishlist.push(work);
      await user.save(); // Save updated user
      return new Response(
        JSON.stringify({
          message: "Work added to wishlist",
          wishlist: user.wishlist,
        }),
        { status: 200 }
      );
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    return new Response("Failed to patch work to wishlist", { status: 500 }); // Return error response
  }
};
