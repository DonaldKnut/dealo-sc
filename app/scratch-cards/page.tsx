"use client";

// Force dynamic rendering for authentication
export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useSafeSession } from "@/hooks/use-safe-session";
import { CreditCard, History, Plus } from "lucide-react";
import ScratchCardPurchase from "@/components/ScratchCardPurchase";
import ScratchCardHistory from "@/components/ScratchCardHistory";

export default function ScratchCardsPage() {
  const session = useSafeSession();
  const { data: sessionData } = session || {};
  const [activeTab, setActiveTab] = useState<"purchase" | "history">(
    "purchase"
  );

  if (!sessionData?.user?.email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please sign in to access scratch card services.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Scratch Cards
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Welcome, {sessionData?.user.name || sessionData?.user.email}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("purchase")}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "purchase"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Purchase Cards
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "history"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <History className="w-4 h-4 mr-2" />
              Transaction History
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === "purchase" ? (
          <ScratchCardPurchase />
        ) : (
          <ScratchCardHistory userEmail={sessionData?.user.email} />
        )}
      </div>

      {/* Footer Information */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About Scratch Cards
              </h3>
              <p className="text-gray-600 text-sm">
                Purchase official WAEC, NECO, and JAMB scratch cards for result
                checking. All cards are genuine and sourced directly from
                official examination bodies.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How It Works
              </h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• Select your exam type and quantity</li>
                <li>• Complete payment through secure channels</li>
                <li>• Receive cards instantly via email</li>
                <li>• Use PIN and Serial to check results</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Support
              </h3>
              <div className="text-gray-600 text-sm space-y-2">
                <p>Need help? Contact our support team:</p>
                <p>📧 support@dealo.com</p>
                <p>📞 +234 XXX XXX XXXX</p>
                <p>🕒 9 AM - 6 PM WAT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
