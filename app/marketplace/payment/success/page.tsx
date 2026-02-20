"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const MarketplacePaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reference =
      searchParams?.get("reference") ||
      searchParams?.get("tx_ref") ||
      searchParams?.get("ref");

    if (!reference) {
      router.push("/marketplace");
      return;
    }

    fetch(`/api/marketplace/payment?reference=${encodeURIComponent(reference)}`)
      .then((r) => r.json())
      .then((data) => {
        setDetails(data);
      })
      .finally(() => setLoading(false));
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        Verifying payment...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 px-6">
      <div className="max-w-3xl mx-auto text-center text-white">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-bold mb-4"
        >
          {details?.success ? "Payment Successful" : "Payment Verification"}
        </motion.h1>
        <p className="text-gray-300 mb-8">
          {details?.success
            ? "Your order has been created in escrow. The freelancer will be notified to start."
            : details?.error || "Could not verify payment."}
        </p>
        <div className="space-x-4">
          <Link
            href="/marketplace"
            className="px-6 py-3 bg-green-600 rounded-xl"
          >
            Back to Marketplace
          </Link>
          <Link
            href="/messages"
            className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl"
          >
            Message Freelancer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePaymentSuccessPage;












