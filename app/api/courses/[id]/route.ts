import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { CourseModel } from "@/models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { CloudflareStreamDataModel } from "@/models/CloudflareStreamData";
import { SectionModel } from "@/models/Section";
import { deleteCloudflareVideo } from "@/service/cloudflareStream";
import { removeInstructorStorage } from "@/lib/instructorStorage";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const course = await CourseModel.findById(params.id);
    if (!course)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ course });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to get course" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connect();
    const body = await req.json();
    const updated = await CourseModel.findOneAndUpdate(
      { _id: params.id, instructor: session.user._id },
      { $set: body },
      { new: true }
    );
    if (!updated)
      return NextResponse.json(
        { error: "Not found or not owner" },
        { status: 404 }
      );
    return NextResponse.json({ course: updated });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    const { id } = params;
    const { bannerUrl } = await request.json();

    const session = await getServerSession({ request, ...authOptions });
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const course = await CourseModel.findById(id);
    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    if (course.instructor.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    course.courseBanner = bannerUrl;
    await course.save();

    return NextResponse.json({
      success: true,
      message: "Banner updated successfully",
      data: course,
    });
  } catch (error: any) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connect();
    const course = await CourseModel.findOne({
      _id: params.id,
      instructor: session.user._id,
    });
    
    if (!course)
      return NextResponse.json(
        { error: "Not found or not owner" },
        { status: 404 }
      );

    // Find all sections in the course
    const sectionIds = course.sections.map((section: { _id: any }) => section._id);
    
    // Find all Cloudflare Stream videos associated with these sections
    const streamDataRecords = await CloudflareStreamDataModel.find({
      sectionId: { $in: sectionIds },
    });

    // Delete videos from Cloudflare Stream and update instructor storage
    const deletionPromises = streamDataRecords.map(async (streamData) => {
      try {
        // Delete from Cloudflare Stream
        if (streamData.uid) {
          const deleted = await deleteCloudflareVideo(streamData.uid);
          if (deleted) {
            console.log(`Deleted video ${streamData.uid} from Cloudflare Stream`);
          }
        }

        // Update instructor storage if fileSize and instructorId are present
        if (streamData.fileSize && streamData.instructorId) {
          await removeInstructorStorage(
            streamData.instructorId.toString(),
            streamData.fileSize
          );
          console.log(
            `Removed ${streamData.fileSize} bytes from instructor ${streamData.instructorId} storage`
          );
        }
      } catch (error) {
        console.error(`Error deleting video ${streamData.uid}:`, error);
        // Continue with other deletions even if one fails
      }
    });

    await Promise.all(deletionPromises);

    // Delete CloudflareStreamData records
    await CloudflareStreamDataModel.deleteMany({
      sectionId: { $in: sectionIds },
    });

    // Delete the course
    await CourseModel.findByIdAndDelete(params.id);

    return NextResponse.json({
      ok: true,
      message: "Course and associated videos deleted successfully",
      videosDeleted: streamDataRecords.length,
    });
  } catch (e: any) {
    console.error("Error deleting course:", e);
    return NextResponse.json(
      { error: e?.message || "Failed to delete course" },
      { status: 500 }
    );
  }
}
