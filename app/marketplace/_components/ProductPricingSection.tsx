import React, { useState } from "react";
import { ShoppingCart, MessageSquare } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Work } from "@/types/types";

const ProductPricingSection: React.FC<{
  work: Work;
  isCreator: boolean;
  onGenerateInsights: () => Promise<string>;
}> = ({ work, isCreator, onGenerateInsights }) => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const insightsPerPage = 3;

  const handleGenerateInsights = async () => {
    setLoading(true);
    setError(null);
    setInsights(null);

    try {
      const result = await onGenerateInsights();
      setInsights(result);
    } catch (err) {
      setError("Failed to generate insights. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatInsight = (text: string) => {
    const words = text.split(" ");
    if (words.length > 4) {
      return `<strong>${words.slice(0, 4).join(" ")}</strong> ${words
        .slice(4)
        .join(" ")}`;
    }
    return `<strong>${text}</strong>`;
  };

  const insightsArray = insights
    ? insights
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item)
    : [];

  const totalPages = Math.ceil(insightsArray.length / insightsPerPage);
  const currentInsights = insightsArray.slice(
    currentPage * insightsPerPage,
    (currentPage + 1) * insightsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="mt-6">
      <p className="text-4xl font-bold text-green-600 mb-2">
        Starting at ${work.price.toFixed(2)}
      </p>
      {work.deliveryDate && work.deliveryTime && (
        <p className="mt-4 text-green-800">
          To be delivered on:{" "}
          <span className="font-semibold">
            {new Date(work.deliveryDate).toLocaleDateString()} at{" "}
            {work.deliveryTime}
          </span>
        </p>
      )}
      {!isCreator && (
        <div className="mt-8 flex flex-col space-y-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold shadow hover:bg-[#7bac95]"
                onClick={handleGenerateInsights}
                disabled={loading}
              >
                {loading ? "Loading Insights..." : "Get Insights"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>AI Insights</DialogTitle>
              <DialogDescription>
                {loading && (
                  <div className="flex justify-center">
                    <Image
                      src="/loading-search.gif"
                      alt="Loading..."
                      height={280}
                      width={260}
                      priority
                    />
                  </div>
                )}
                {error && <p className="text-red-500">{error}</p>}

                {currentInsights.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      {currentInsights.map((insight, index) => (
                        <p
                          key={index}
                          className="text-gray-800"
                          dangerouslySetInnerHTML={{
                            __html: formatInsight(insight),
                          }}
                        />
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <Button
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                        className="bg-gray-800 text-white hover:bg-gray-900"
                      >
                        Previous
                      </Button>
                      <span className="text-gray-700">
                        Page {currentPage + 1} of {totalPages}
                      </span>
                      <Button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1}
                        className="bg-gray-800 text-white hover:bg-gray-900"
                      >
                        Next
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600">No insights available.</p>
                )}
              </DialogDescription>
            </DialogContent>
          </Dialog>
          <button className="flex-1 bg-green-700 text-white py-3 rounded-lg font-semibold shadow hover:bg-green-900 flex items-center justify-center gap-2">
            <ShoppingCart />
            Add to Cart
          </button>
          <button className="flex-1 bg-green-100 text-green-800 py-3 rounded-lg font-semibold shadow hover:bg-green-200 flex items-center justify-center gap-2">
            <MessageSquare />
            Message Freelancer
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductPricingSection;
