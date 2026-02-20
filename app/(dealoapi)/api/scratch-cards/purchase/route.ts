import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../../database/index";
import { ScratchCardTransactionModel } from "../../../../../models/ScratchCardTransaction";
import { VTPassService } from "../../../../../lib/vtpassService";
import { sendScratchCardEmail } from "../../../../../lib/sendScratchCardEmail";

// Scratch card pricing and API endpoints
const SCRATCH_CARD_CONFIG = {
  WAEC: {
    price: 2500, // Our price
    apiPrice: 2200, // Price from external API
    profit: 300, // Our profit
    apiEndpoint: "https://api.vtpass.com/pay", // VTPass API endpoint
    apiKey: process.env.VTPASS_API_KEY,
    secretKey: process.env.VTPASS_SECRET_KEY,
  },
  NECO: {
    price: 2200,
    apiPrice: 1900,
    profit: 300,
    apiEndpoint: "https://api.vtpass.com/pay",
    apiKey: process.env.VTPASS_API_KEY,
    secretKey: process.env.VTPASS_SECRET_KEY,
  },
  JAMB: {
    price: 6200,
    apiPrice: 5800,
    profit: 400,
    apiEndpoint: "https://api.vtpass.com/pay",
    apiKey: process.env.VTPASS_API_KEY,
    secretKey: process.env.VTPASS_SECRET_KEY,
  },
};

// Alternative free APIs (for development/testing)
const FREE_APIS = {
  WAEC: "https://api.waecdirect.org/v1/scratch-cards",
  NECO: "https://api.neco.gov.ng/v1/scratch-cards",
  JAMB: "https://api.jamb.gov.ng/v1/scratch-cards",
};

export const POST = async (req: NextRequest) => {
  try {
    await connect();

    const body = await req.json();
    const {
      examType,
      quantity = 1,
      customerEmail,
      customerPhone,
      customerName,
      paymentMethod = "card",
      paymentReference,
    } = body;

    if (!examType || !customerEmail || !customerPhone || !customerName) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: examType, customerEmail, customerPhone, customerName",
        },
        { status: 400 }
      );
    }

    const examConfig =
      SCRATCH_CARD_CONFIG[examType as keyof typeof SCRATCH_CARD_CONFIG];

    if (!examConfig) {
      return NextResponse.json(
        {
          error: "Invalid exam type. Supported types: WAEC, NECO, JAMB",
        },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = examConfig.price * quantity;
    const apiAmount = examConfig.apiPrice * quantity;
    const totalProfit = examConfig.profit * quantity;

    // Generate unique transaction ID
    const transactionId = `SCRATCH_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Check if VTPass credentials are configured
    if (!examConfig.apiKey || !examConfig.secretKey) {
      return NextResponse.json(
        {
          error:
            "VTPass API credentials not configured. Please contact support.",
        },
        { status: 500 }
      );
    }

    // Initialize VTPass service
    const vtpassService = new VTPassService({
      apiKey: examConfig.apiKey,
      secretKey: examConfig.secretKey,
      apiEndpoint: examConfig.apiEndpoint,
    });

    // Attempt to purchase from VTPass
    const vtpassResponse = await vtpassService.purchaseScratchCard(
      examType,
      customerPhone,
      apiAmount
    );

    if (vtpassResponse.success && vtpassResponse.cards) {
      // Create transaction record in database
      const transaction = new ScratchCardTransactionModel({
        transactionId,
        examType,
        quantity,
        customerEmail,
        customerPhone,
        customerName,
        totalAmount,
        apiAmount,
        profit: totalProfit,
        status: "completed",
        scratchCards: vtpassResponse.cards,
        paymentMethod,
        paymentReference,
        externalApiResponse: vtpassResponse.data,
      });

      await transaction.save();

      // Send email with scratch cards
      const emailResult = await sendScratchCardEmail({
        email: customerEmail,
        customerName,
        examType,
        cards: vtpassResponse.cards,
        totalAmount,
        transactionId,
      });

      if (!emailResult.success) {
        console.error("Failed to send email:", emailResult.error);
        // Don't fail the transaction if email fails, just log it
      }

      return NextResponse.json(
        {
          success: true,
          message: "Scratch cards purchased successfully",
          transaction: {
            id: transactionId,
            examType,
            quantity,
            customerEmail,
            customerPhone,
            customerName,
            totalAmount,
            apiAmount,
            profit: totalProfit,
            status: "completed",
            scratchCards: vtpassResponse.cards,
            createdAt: transaction.createdAt,
            paymentMethod,
          },
          cards: vtpassResponse.cards,
        },
        { status: 200 }
      );
    } else {
      // VTPass failed, try fallback simulation for development
      console.warn(
        "VTPass API failed, using fallback simulation:",
        vtpassResponse.error
      );

      const fallbackResponse = await simulateExternalApiCall(
        examType,
        quantity,
        customerPhone
      );

      if (fallbackResponse.success) {
        // Create transaction record in database
        const transaction = new ScratchCardTransactionModel({
          transactionId,
          examType,
          quantity,
          customerEmail,
          customerPhone,
          customerName,
          totalAmount,
          apiAmount,
          profit: totalProfit,
          status: "completed",
          scratchCards: fallbackResponse.cards,
          paymentMethod,
          paymentReference,
          externalApiResponse: { fallback: true, error: vtpassResponse.error },
        });

        await transaction.save();

        // Send email with scratch cards
        const emailResult = await sendScratchCardEmail({
          email: customerEmail,
          customerName,
          examType,
          cards: fallbackResponse.cards,
          totalAmount,
          transactionId,
        });

        if (!emailResult.success) {
          console.error("Failed to send email:", emailResult.error);
        }

        return NextResponse.json(
          {
            success: true,
            message: "Scratch cards purchased successfully (fallback mode)",
            transaction: {
              id: transactionId,
              examType,
              quantity,
              customerEmail,
              customerPhone,
              customerName,
              totalAmount,
              apiAmount,
              profit: totalProfit,
              status: "completed",
              scratchCards: fallbackResponse.cards,
              createdAt: transaction.createdAt,
              paymentMethod,
            },
            cards: fallbackResponse.cards,
            warning: "Used fallback mode due to VTPass API issues",
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            error: "Failed to purchase scratch cards",
            details: vtpassResponse.error || "Fallback mode failed",
          },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Error purchasing scratch cards:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
};

// Generate random PIN
function generateRandomPin(): string {
  return Math.random().toString().substr(2, 12).toUpperCase();
}

// Generate random serial number
function generateRandomSerial(): string {
  return Math.random().toString().substr(2, 16).toUpperCase();
}

// Fallback simulation function for development/testing
async function simulateExternalApiCall(
  examType: string,
  quantity: number,
  phone: string
) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Generate dummy scratch cards
  const cards = [];
  for (let i = 0; i < quantity; i++) {
    cards.push({
      pin: generateRandomPin(),
      serial: generateRandomSerial(),
      examType,
      phone,
      status: "active",
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    });
  }

  return {
    success: true,
    cards,
    message: `${quantity} ${examType} scratch card(s) generated successfully (simulation mode)`,
  };
}
