import { connect } from "@/database";
import { UserModel } from "@/models/User"; // Adjust the path according to your project structure
import { NextResponse } from "next/server"; // If using Next.js

// Define the POST handler
export const POST = async (
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> => {
  try {
    const { cart } = await req.json(); // Parse JSON body from request
    await connect(); // Connect to the database

    const userId = params.id; // Extract userId from params
    const user = await UserModel.findById(userId); // Find user by ID

    if (!user) {
      return new Response("User not found", { status: 404 }); // Handle case where user is not found
    }

    user.cart = cart; // Update user's cart with new data
    await user.save(); // Save updated user

    return NextResponse.json(user.cart, { status: 200 }); // Return JSON response with updated cart
  } catch (err) {
    console.error(err); // Log the error for debugging
    return new Response("Failed to update cart", { status: 500 }); // Return error response
  }
};
