"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Loader2,
  CreditCard,
  Mail,
  Phone,
  User,
  CheckCircle,
} from "lucide-react";

interface ScratchCardConfig {
  price: number;
  apiPrice: number;
  profit: number;
}

interface ScratchCard {
  pin: string;
  serial: string;
  examType: string;
  phone: string;
  status: string;
  expiryDate: Date;
}

const SCRATCH_CARD_CONFIG: Record<string, ScratchCardConfig> = {
  WAEC: {
    price: 2500,
    apiPrice: 2200,
    profit: 300,
  },
  NECO: {
    price: 2200,
    apiPrice: 1900,
    profit: 300,
  },
  JAMB: {
    price: 6200,
    apiPrice: 5800,
    profit: 400,
  },
};

export default function ScratchCardPurchase() {
  const [formData, setFormData] = useState({
    examType: "",
    quantity: 1,
    customerEmail: "",
    customerPhone: "",
    customerName: "",
    paymentMethod: "card",
  });

  const [loading, setLoading] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<{
    success: boolean;
    transaction?: any;
    cards?: ScratchCard[];
    warning?: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value) || 1;
    setFormData((prev) => ({
      ...prev,
      quantity: Math.max(1, Math.min(10, quantity)), // Limit to 1-10
    }));
  };

  const calculateTotal = () => {
    if (!formData.examType) return 0;
    const config = SCRATCH_CARD_CONFIG[formData.examType];
    return config ? config.price * formData.quantity : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPurchaseResult(null);

    try {
      const response = await fetch("/api/scratch-cards/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          paymentReference: `PAY_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setPurchaseResult({
          success: true,
          transaction: result.transaction,
          cards: result.cards,
          warning: result.warning,
        });
        toast.success("Scratch cards purchased successfully!");
        if (result.warning) {
          toast.error(result.warning);
        }
      } else {
        throw new Error(result.error || "Purchase failed");
      }
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast.error(error.message || "Failed to purchase scratch cards");
      setPurchaseResult({
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      examType: "",
      quantity: 1,
      customerEmail: "",
      customerPhone: "",
      customerName: "",
      paymentMethod: "card",
    });
    setPurchaseResult(null);
  };

  if (purchaseResult?.success) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Purchase Successful!
          </h2>
          <p className="text-gray-600">
            Your scratch cards have been purchased and sent to your email.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-800 mb-2">
            Transaction Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Transaction ID:</span>
              <p className="text-gray-900">{purchaseResult.transaction?.id}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Exam Type:</span>
              <p className="text-gray-900">
                {purchaseResult.transaction?.examType}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Quantity:</span>
              <p className="text-gray-900">
                {purchaseResult.transaction?.quantity}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Total Amount:</span>
              <p className="text-gray-900">
                ₦{purchaseResult.transaction?.totalAmount?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {purchaseResult.warning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">{purchaseResult.warning}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">
            Scratch Card Details
          </h3>
          <div className="space-y-3">
            {purchaseResult.cards?.map((card, index) => (
              <div
                key={index}
                className="bg-white border border-blue-300 rounded-lg p-3"
              >
                <h4 className="font-medium text-blue-900 mb-2">
                  Card {index + 1}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">PIN:</span>
                    <p className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {card.pin}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Serial:</span>
                    <p className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {card.serial}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={resetForm}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Purchase Another Card
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Purchase Scratch Cards
        </h2>
        <p className="text-gray-600">
          Buy WAEC, NECO, or JAMB scratch cards for result checking
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Exam Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Type *
          </label>
          <select
            name="examType"
            value={formData.examType}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Exam Type</option>
            <option value="WAEC">WAEC - ₦2,500</option>
            <option value="NECO">NECO - ₦2,200</option>
            <option value="JAMB">JAMB - ₦6,200</option>
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity *
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleQuantityChange}
            min="1"
            max="10"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Maximum 10 cards per purchase
          </p>
        </div>

        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Customer Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Full Name *
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address *
            </label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number *
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method *
          </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="card">Credit/Debit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="wallet">Wallet</option>
            <option value="paystack">Paystack</option>
            <option value="flutterwave">Flutterwave</option>
          </select>
        </div>

        {/* Price Summary */}
        {formData.examType && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Price Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Price per card:</span>
                <span>
                  ₦
                  {SCRATCH_CARD_CONFIG[
                    formData.examType
                  ]?.price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span>{formData.quantity}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total Amount:</span>
                <span>₦{calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !formData.examType}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Purchase for ₦${calculateTotal().toLocaleString()}`
          )}
        </button>
      </form>

      {/* Information */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">
          Important Information
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Scratch cards will be sent to your email address</li>
          <li>• Cards are valid for 1 year from purchase date</li>
          <li>• Keep your PIN and Serial numbers confidential</li>
          <li>• Contact support if you don&apos;t receive your cards</li>
        </ul>
      </div>
    </div>
  );
}
