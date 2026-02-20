export type PaymentProvider = "paystack" | "flutterwave";

export type InitializePaymentInput = {
  email: string;
  amount: number; // in base currency unit (naira)
  reference: string; // our generated ref
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

export type InitializePaymentResult = {
  authorizationUrl: string;
  reference: string;
  provider: PaymentProvider;
};

export type VerifyPaymentResult = {
  success: boolean;
  status: "success" | "failed" | "pending";
  amount: number;
  reference: string;
  provider: PaymentProvider;
  raw?: any;
  channel?: string;
};

export function getSelectedProvider(): PaymentProvider {
  const provider = (
    process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || "paystack"
  ).toLowerCase();
  return provider === "flutterwave" ? "flutterwave" : "paystack";
}

export function requireProviderEnvOrThrow(provider: PaymentProvider) {
  if (provider === "paystack") {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      throw new Error(
        "PAYSTACK_SECRET_KEY is not set. Configure env or switch provider."
      );
    }
    return;
  }
  if (provider === "flutterwave") {
    if (!process.env.FLW_SECRET_KEY) {
      throw new Error(
        "FLW_SECRET_KEY is not set. Configure env or switch provider."
      );
    }
    return;
  }
}

export async function initializePayment(
  input: InitializePaymentInput
): Promise<InitializePaymentResult> {
  const provider = getSelectedProvider();
  requireProviderEnvOrThrow(provider);

  if (provider === "paystack") {
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        amount: input.amount * 100,
        reference: input.reference,
        callback_url: input.callbackUrl,
        metadata: input.metadata,
        channels: ["card", "bank", "ussd", "bank_transfer"],
      }),
    });
    const data = await res.json();
    if (!data?.status) {
      throw new Error(data?.message || "Paystack init failed");
    }
    return {
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
      provider,
    };
  }

  // Flutterwave
  const flwPayload = {
    tx_ref: input.reference,
    amount: input.amount,
    currency: "NGN",
    redirect_url: input.callbackUrl,
    customer: {
      email: input.email,
    },
    meta: input.metadata || {},
    payment_options: "card,banktransfer,ussd",
  };
  const res = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(flwPayload),
  });
  const data = await res.json();
  if (data?.status !== "success") {
    throw new Error(data?.message || "Flutterwave init failed");
  }
  return {
    authorizationUrl: data.data.link,
    reference: input.reference,
    provider,
  };
}

export async function verifyPayment(
  referenceOrTxRef: string
): Promise<VerifyPaymentResult> {
  const provider = getSelectedProvider();
  requireProviderEnvOrThrow(provider);

  if (provider === "paystack") {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${referenceOrTxRef}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    const data = await res.json();
    if (!data?.status) {
      return {
        success: false,
        status: "failed",
        amount: 0,
        reference: referenceOrTxRef,
        provider,
        raw: data,
      };
    }
    const status =
      data.data.status === "success"
        ? "success"
        : data.data.status === "failed"
        ? "failed"
        : "pending";
    return {
      success: status === "success",
      status,
      amount: (data.data.amount || 0) / 100,
      reference: data.data.reference,
      provider,
      raw: data,
      channel: data.data.channel,
    };
  }

  // Flutterwave verify
  const res = await fetch(
    `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(
      referenceOrTxRef
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      },
    }
  );
  const data = await res.json();
  if (data?.status !== "success") {
    return {
      success: false,
      status: "failed",
      amount: 0,
      reference: referenceOrTxRef,
      provider,
      raw: data,
    };
  }
  const payment = data?.data?.[0] || data?.data || {};
  const status =
    payment?.status === "successful"
      ? "success"
      : payment?.status === "failed"
      ? "failed"
      : "pending";
  return {
    success: status === "success",
    status,
    amount: Number(payment?.amount || 0),
    reference: payment?.tx_ref || referenceOrTxRef,
    provider,
    raw: data,
    channel: payment?.payment_type,
  };
}












