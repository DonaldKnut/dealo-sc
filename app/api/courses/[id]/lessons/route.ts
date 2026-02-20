import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { CourseModel } from "@/models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connect();
    const body = await req.json();

    const course = await CourseModel.findOne({
      _id: params.id,
      instructor: session.user._id,
    });
    if (!course)
      return NextResponse.json(
        { error: "Not found or not owner" },
        { status: 404 }
      );

    // Ensure section exists or create default
    let section = course.sections[0];
    if (!section) {
      course.sections.push({
        title: "Section 1",
        order: 1,
        isPublished: true,
        lectures: [],
      } as any);
      section = course.sections[0];
    }

    const order = (section.lectures?.length || 0) + 1;
    section.lectures.push({
      title: body.title,
      description: body.description,
      type: "video",
      content: {
        url: body.url,
        duration: body.duration,
        thumbnail: body.thumbnail,
      },
      isPreview: !!body.isPreview,
      isPublished: true,
      order,
      resources: [],
      requirements: { mustCompletePrevious: false },
    } as any);

    await course.save();

    return NextResponse.json({ course });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to add lesson" },
      { status: 500 }
    );
  }
}
