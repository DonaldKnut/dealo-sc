import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Scratch card pricing configuration
const SCRATCH_CARD_PRICES = {
  WAEC: {
    name: "West African Examinations Council",
    price: 2500,
    originalPrice: 2800,
    discount: 300,
    features: [
      "Instant delivery",
      "Official scratch card",
      "24/7 support",
      "Email delivery",
      "Refund guarantee",
    ],
    description:
      "Check your WAEC result instantly with our official scratch cards",
    validity: "1 year",
    processingTime: "Instant",
  },
  NECO: {
    name: "National Examinations Council",
    price: 2200,
    originalPrice: 2500,
    discount: 300,
    features: [
      "Secure payment",
      "Email delivery",
      "Refund guarantee",
      "Official portal",
      "24/7 support",
    ],
    description:
      "Access your NECO results with our secure and reliable scratch cards",
    validity: "1 year",
    processingTime: "Instant",
  },
  JAMB: {
    name: "Joint Admissions and Matriculation Board",
    price: 6200,
    originalPrice: 6800,
    discount: 600,
    features: [
      "Official portal",
      "SMS notification",
      "Customer support",
      "Instant delivery",
      "Secure payment",
    ],
    description: "Get your JAMB result with our official scratch cards",
    validity: "1 year",
    processingTime: "Instant",
  },
};

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const examType = searchParams.get("type");

    if (examType) {
      const examData =
        SCRATCH_CARD_PRICES[examType as keyof typeof SCRATCH_CARD_PRICES];

      if (!examData) {
        return NextResponse.json(
          {
            error: "Invalid exam type. Supported types: WAEC, NECO, JAMB",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          examType,
          data: examData,
        },
        { status: 200 }
      );
    }

    // Return all prices
    return NextResponse.json(
      {
        success: true,
        prices: SCRATCH_CARD_PRICES,
        summary: {
          totalExams: Object.keys(SCRATCH_CARD_PRICES).length,
          priceRange: {
            min: Math.min(
              ...Object.values(SCRATCH_CARD_PRICES).map((p) => p.price)
            ),
            max: Math.max(
              ...Object.values(SCRATCH_CARD_PRICES).map((p) => p.price)
            ),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching scratch card prices:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
};
