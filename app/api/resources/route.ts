import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { ResourceModel } from "@/models/Resource";
import { UserModel } from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connect();
    const body = await req.json();
    // Resolve uploader ObjectId via email
    const dbUser = await UserModel.findOne({
      email: session.user.email,
    }).select("_id");
    const uploaderObjectId = dbUser?._id;
    const doc = await ResourceModel.create({
      title: body.title,
      url: body.url,
      type: body.type,
      sectionId: body.sectionId,
      uploaderId: uploaderObjectId,
      courseId: body.courseId,
      sizeBytes: body.sizeBytes,
      isPaid: !!body.isPaid,
      price: Number(body.price || 0),
      currency: body.currency || "NGN",
    });
    return NextResponse.json({ resource: doc });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connect();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const dbUser = await UserModel.findOne({
      email: session.user.email,
    }).select("_id");
    const q: any = { uploaderId: dbUser?._id };
    if (courseId) q.courseId = courseId;
    const items = await ResourceModel.find(q).sort({ createdAt: -1 });
    return NextResponse.json({ resources: items });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}
