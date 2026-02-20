import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../../../database/index";
import IWork from "@/models/Work";

// Define types for query parameters
interface Params {
  query: string;
}

export const GET = async (req: NextRequest, { params }: { params: Params }) => {
  try {
    // Connect to the database
    await connect();

    const { query } = params;
    let works: any[] = [];

    if (query === "all") {
      works = await IWork.find().populate("creator").exec();
    } else {
      works = await IWork.find({
        $or: [
          { category: { $regex: query, $options: "i" } },
          { title: { $regex: query, $options: "i" } },
        ],
      })
        .populate("creator")
        .exec();
    }

    console.log(works);

    if (works.length === 0) {
      return NextResponse.json("No works found", { status: 404 });
    }

    return NextResponse.json(works, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json("Internal server error", { status: 500 });
  }
};
