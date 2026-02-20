import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { UserModel } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const user = await UserModel.findById(session.user._id).select("credits");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ credits: user.credits }, { status: 200 });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
