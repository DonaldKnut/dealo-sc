import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import Resume from "@/models/Resume";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connect();

    const resumeData = await request.json();
    const { id, ...resumeFields } = resumeData;

    // Validate required fields
    if (
      !resumeFields.personalInfo?.firstName ||
      !resumeFields.personalInfo?.lastName
    ) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    // Resolve user by _id if present else email (handles OAuth numeric ids)
    const sessionAny = session.user as any;
    const userId = sessionAny?._id || sessionAny?.id || null;

    let resume;
    if (id) {
      // Update existing resume
      resume = await Resume.findOneAndUpdate(
        { _id: id, userId: userId },
        { ...resumeFields, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!resume) {
        return NextResponse.json(
          { error: "Resume not found or access denied" },
          { status: 404 }
        );
      }
    } else {
      // Create new resume
      resume = new Resume({
        ...resumeFields,
        userId: userId,
      });
      await resume.save();
    }

    return NextResponse.json({
      success: true,
      resume,
      message: id
        ? "Resume updated successfully"
        : "Resume created successfully",
    });
  } catch (error) {
    console.error("Resume save error:", error);
    return NextResponse.json(
      { error: "Failed to save resume" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Get specific resume
      const sessionAny = session.user as any;
      const userId = sessionAny?._id || sessionAny?.id || null;
      let resume = null as any;
      const { Types } = await import("mongoose");
      if (userId && Types.ObjectId.isValid(userId)) {
        resume = await Resume.findOne({ _id: id, userId });
      } else {
        // fallback by email
        const { UserModel } = await import("@/models/User");
        const user = await UserModel.findOne({
          email: session.user.email,
        }).select("_id");
        resume = await Resume.findOne({ _id: id, userId: user?._id });
      }

      if (!resume) {
        return NextResponse.json(
          { error: "Resume not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ resume });
    } else {
      // Get all user resumes
      const sessionAny = session.user as any;
      const userId = sessionAny?._id || sessionAny?.id || null;
      let userFilter: any = {};
      const { Types } = await import("mongoose");
      if (userId && Types.ObjectId.isValid(userId)) {
        userFilter.userId = userId;
      } else {
        const { UserModel } = await import("@/models/User");
        const user = await UserModel.findOne({
          email: session.user.email,
        }).select("_id");
        userFilter.userId = user?._id;
      }
      const resumes = await Resume.find(userFilter)
        .sort({ updatedAt: -1 })
        .select("title template isDefault createdAt updatedAt");

      return NextResponse.json({ resumes });
    }
  } catch (error) {
    console.error("Resume fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume(s)" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 }
      );
    }

    const resume = await Resume.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Resume delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 }
    );
  }
}
