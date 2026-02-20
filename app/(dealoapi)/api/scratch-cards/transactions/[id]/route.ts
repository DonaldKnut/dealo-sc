import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../../../database/index";
import { ScratchCardTransactionModel } from "../../../../../../models/ScratchCardTransaction";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connect();

    const transactionId = params.id;

    if (!transactionId) {
      return NextResponse.json(
        {
          error: "Transaction ID is required",
        },
        { status: 400 }
      );
    }

    // Get transaction by ID
    const transaction = await ScratchCardTransactionModel.findOne({
      transactionId: transactionId,
    })
      .select("-__v")
      .lean();

    if (!transaction) {
      return NextResponse.json(
        {
          error: "Transaction not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: transaction,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
};
