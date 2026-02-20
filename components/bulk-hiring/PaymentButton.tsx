"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Lock, CheckCircle } from "lucide-react";

interface PaymentButtonProps {
  requestId: string;
  amount: number;
  paymentType: "deposit" | "final";
  companyEmail: string;
  onSuccess?: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  requestId,
  amount,
  paymentType,
  companyEmail,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/bulk-hiring/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          amount,
          paymentType,
          companyEmail,
        }),
      });

      const data = await response.json();

      if (data.success && data.authorizationUrl) {
        // Redirect to Paystack payment page
        window.location.href = data.authorizationUrl;
      } else {
        alert("Failed to initialize payment. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handlePayment}
      disabled={isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
        isLoading
          ? "bg-gray-600 cursor-not-allowed"
          : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-2xl hover:shadow-green-500/25"
      } text-white`}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="w-5 h-5" />
          Pay ₦{amount.toLocaleString()}{" "}
          {paymentType === "deposit" ? "(50% Deposit)" : "(Final Payment)"}
          <Lock className="w-4 h-4 ml-2" />
        </>
      )}
    </motion.button>
  );
};

export default PaymentButton;












