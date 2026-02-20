import { NextResponse } from "next/server";
import { connect } from "@/database";
import { UserModel } from "@/models/User";

// API route handler for getting user status
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Establish database connection
    await connect();

    // Fetch user by ID
    const user = await UserModel.findById(id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return the user's status
    return NextResponse.json({ status: user.status }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
