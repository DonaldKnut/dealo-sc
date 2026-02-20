import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { UserModel } from "@/models/User";
import { connect } from "@/database";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const body = await request.json();
    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      role,
      interests,
      isProfileComplete,
      bio,
      serviceArea,
      servicesOffered,
      isAvailable,
      availableDays,
      availabilitySlots,
      location,
    } = body;

    // Calculate age and teen account status
    const birthDate = new Date(dateOfBirth);
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthDate.getFullYear();
    const isTeenAccount = age < 18;

    // Update user profile
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: session.user.email },
      {
        firstName,
        lastName,
        phone,
        dateOfBirth: birthDate,
        isTeenAccount,
        role,
        interests: interests ? [interests] : [],
        isProfileComplete: isProfileComplete || true,
        bio: bio || interests || "",
        serviceArea: serviceArea || "",
        servicesOffered: servicesOffered || [],
        isAvailable: isAvailable || true,
        availableDays: availableDays || ["Mon", "Tue", "Wed", "Thu", "Fri"],
        availabilitySlots: availabilitySlots || [],
        location: location || {
          type: "Point",
          coordinates: [0, 0],
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile completed successfully",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        isProfileComplete: updatedUser.isProfileComplete,
      },
    });
  } catch (error) {
    console.error("Profile completion error:", error);
    return NextResponse.json(
      { error: "Failed to complete profile" },
      { status: 500 }
    );
  }
}
