import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../../database/index";
import { ScratchCardTransactionModel } from "../../../../../models/ScratchCardTransaction";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  try {
    await connect();

    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const status = url.searchParams.get("status");

    if (!email) {
      return NextResponse.json(
        {
          error: "Email parameter is required",
        },
        { status: 400 }
      );
    }

    // Build query
    const query: any = { customerEmail: email };
    if (status) {
      query.status = status;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get transactions with pagination
    const transactions = await ScratchCardTransactionModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v")
      .lean();

    // Get total count for pagination
    const total = await ScratchCardTransactionModel.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json(
      {
        success: true,
        data: {
          transactions,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage,
            hasPrevPage,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
};
