"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Download, Mail } from "lucide-react";
import Link from "next/link";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const reference =
      searchParams?.get("reference") ||
      searchParams?.get("tx_ref") ||
      searchParams?.get("ref");

    if (!reference) {
      router.push("/employment/bulk-hiring");
      return;
    }

    // Verify payment (supports both providers)
    fetch(`/api/bulk-hiring/payment?reference=${encodeURIComponent(reference)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPaymentDetails(data);
        } else {
          alert("Payment verification failed");
          router.push("/employment/bulk-hiring");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Verification error:", error);
        setIsLoading(false);
      });
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-16 h-16 text-white" />
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Payment Successful! 🎉
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Thank you for your payment. Your bulk hiring request is now being
            processed.
          </p>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-left">
                  <p className="text-gray-400 text-sm mb-1">Amount Paid</p>
                  <p className="text-3xl font-bold text-white">
                    ₦{paymentDetails.amount?.toLocaleString()}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-gray-400 text-sm mb-1">Payment Type</p>
                  <p className="text-xl font-semibold text-green-400 capitalize">
                    {paymentDetails.metadata?.paymentType || "Deposit"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-white/5 rounded-2xl p-8 mb-8 border border-white/10 text-left">
            <h2 className="text-2xl font-bold text-white mb-4">
              What Happens Next?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Email Confirmation
                  </h3>
                  <p className="text-gray-300">
                    You'll receive a payment receipt and confirmation email
                    within minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Discovery Call
                  </h3>
                  <p className="text-gray-300">
                    Our team will contact you within 24 hours to schedule a
                    detailed discovery call.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Candidate Profiles
                  </h3>
                  <p className="text-gray-300">
                    We'll share pre-vetted candidate profiles matching your
                    requirements.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Team Deployment
                  </h3>
                  <p className="text-gray-300">
                    Once approved, your team will be deployed and ready to start
                    working.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-300"
            >
              Back to Home
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="mailto:hello@dealo.africa"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300 border border-white/20"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </a>
          </div>

          {/* Contact Information */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-gray-400 mb-2">Need immediate assistance?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-gray-300">
              <a
                href="mailto:hello@dealo.africa"
                className="hover:text-green-400 transition-colors"
              >
                hello@dealo.africa
              </a>
              <span className="hidden sm:block">•</span>
              <a
                href="tel:+234XXXXXXXX"
                className="hover:text-green-400 transition-colors"
              >
                +234 XXX XXX XXXX
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
