import { getServerSession } from "next-auth/next";
import { UserModel } from "@/models/User";
import { CompanyModel } from "@/models/Company";
import { authOptions } from "@/authOptions/authOptions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { orgId: string } }
) {
  const session = await getServerSession({ req, ...authOptions });

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { orgId } = params;
  console.log("Received orgId from params:", orgId);

  if (!orgId) {
    return NextResponse.json(
      { error: "Organization ID is required" },
      { status: 400 }
    );
  }

  try {
    const user = await UserModel.findOne({ email: session.user.email });

    const company = await CompanyModel.findById(orgId);
    console.log("Company found:", company);

    if (user && company && company.owner.toString() === user._id.toString()) {
      console.log("Access granted");
      return NextResponse.json({ hasAccess: true }, { status: 200 });
    } else {
      console.log("Access denied");
      return NextResponse.json({ hasAccess: false }, { status: 403 });
    }
  } catch (error) {
    console.error("Error checking access:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
