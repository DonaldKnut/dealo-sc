import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../../../database/index";
import IWork from "@/models/Work";

export const GET = async (
  req: NextRequest,
  { params }: { params: { category: string } }
) => {
  try {
    await connect();

    const { category } = params;

    let workList;

    if (category !== "All") {
      workList = await IWork.find({ category }).populate("creator").exec();
    } else {
      workList = await IWork.find().populate("creator").exec();
    }

    return NextResponse.json(workList, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
};
