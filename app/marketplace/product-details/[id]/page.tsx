"use client";

// Force dynamic rendering for authentication
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSafeSession } from "@/hooks/use-safe-session";
import ProductDetails from "../../_components/ProductDetails";
import HighFidelityUI from "../../_components/HighFidelityUI";
import Footer from "@/components/FreelanceComponents/Footer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateProductViewerPrompt } from "../../_components/productPrompt";
import { Role } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  connections?: string[];
  credits?: number;
}

interface Product {
  name: string;
  freelancerName: string;
  freelancerRating: number;
  price: number;
  category: string;
}

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

const ProductDetailsPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const session = useSafeSession(); const { data: sessionData } = session || {};
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");
  const workId = searchParams.get("workId");

  const [user, setUser] = useState<User | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  console.log("Product ID from params:", id);
  console.log("Session User ID:", sessionData?.user?.id);
  console.log("Query Params - userId:", userId, "workId:", workId);

  useEffect(() => {
    if (!id || typeof id !== "string") {
      setFetchError("Invalid product ID.");
      return;
    }

    const fetchDetails = async () => {
      setFetchError(null);

      try {
        if (!userId || !workId) {
          setFetchError("Invalid request parameters.");
          return;
        }

        const response = await fetch(
          `/api/fetch-details?userId=${encodeURIComponent(
            userId
          )}&workId=${encodeURIComponent(workId)}`
        );

        if (!response.ok) {
          if (response.status === 401) {
            setFetchError("Unauthorized");
            return;
          }
          throw new Error("Failed to fetch user and product details.");
        }

        const data: { user: User; product: Product } = await response.json();
        setUser(data.user);
        setProduct(data.product);
      } catch (err) {
        setFetchError("An error occurred while fetching the details.");
        console.error(err);
      }
    };

    fetchDetails();
  }, [id, userId, workId]);

  // 🛑 Unauthorized Error - Full-Screen Message
  if (fetchError === "Unauthorized") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
        <div className="bg-white p-8 rounded-lg text-center">
          <Image
            src="/find_no_see.png"
            alt="Login Illustration"
            width={200}
            height={200}
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold mb-4">You Are Not Logged In</h2>
          <p className="text-gray-600 mb-6">
            Please log in or sign up to view this page.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push("/sign-in")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Log In
            </button>
            <button
                              onClick={() => router.push("/sign-in")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🛑 General Fetch Error - Full-Screen Message
  if (fetchError) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100">
        <Image
          src="/find_no_see.png"
          alt="Error Illustration"
          width={300}
          height={300}
          className="mb-6"
        />
        <h2 className="text-3xl font-bold text-red-600 mb-4">
          Oops! Something Went Wrong
        </h2>
        <p className="text-gray-700 mb-6">{fetchError}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div>
        {product && user && (
          <ProductDetails
            id={id}
            currentUser={user}
            genAI={genAI}
            generateProductViewerPrompt={generateProductViewerPrompt}
          />
        )}
        <HighFidelityUI />
        <Footer />
      </div>
    </>
  );
};

export default ProductDetailsPage;
