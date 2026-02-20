import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { JobApplicationModel } from "@/models/JobApplication";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connect();
    const apps = await JobApplicationModel.find({
      userId: session.user.id,
    }).sort({ _id: -1 });
    return NextResponse.json({ applications: apps });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connect();
    const { externalJobUrl, jobTitle, company, resumeId, coverLetter } =
      await req.json();
    if (!resumeId || !jobTitle)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const doc = await JobApplicationModel.create({
      jobId: undefined,
      userId: session.user.id,
      coverLetter: coverLetter || "",
      resume: String(resumeId),
      status: "pending",
    } as any);
    return NextResponse.json({ success: true, application: doc });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
