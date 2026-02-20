"use client";

// Force dynamic rendering for authentication
export const dynamic = "force-dynamic";
import React, { useState, useEffect } from "react";
import Form from "../create-work/_components/Form";
import { useSafeSession } from "@/hooks/use-safe-session";
import { useRouter } from "next/navigation";
// import Topbar from "./_components/Topbar";
import { Work } from "../create-work/(data)/validationSchemas";

const Page: React.FC = () => {
  const session = useSafeSession(); const { data: sessionData } = session || {};
  const router = useRouter();

  // Initialize the work state with default values
  const [work, setWork] = useState<Work>({
    category: "All",
    title: "",
    description: "",
    price: 0,
    workMedia: [], // ✅ correct name
    skills: [],
    deliveryDate: "",
    deliveryTime: "",
    contactInfo: { email: "", phone: "" }, // ✅ correct name
    portfolioLink: "",
    languagesSpoken: [],
    experienceLevel: "Junior",
    certifications: [],
  });

  // Set the creator field (if needed for the API)
  useEffect(() => {
    if (session) {
      setWork((prevWork) => ({
        ...prevWork,
        contactInformation: {
          ...prevWork.contactInfo,
          email: sessionData?.user?.email || "",
        },
      }));
    }
  }, [session, sessionData?.user, sessionData?.user?.email]);

  // Handle form submission
  const handleSubmit = async (data: Work) => {
    try {
      const formData = new FormData();

      // Append data to the FormData object
      Object.entries(data).forEach(([key, value]) => {
        if (key === "workMedia") {
          (value as { url: string; type: "image" | "video" }[]).forEach(
            (media) => {
              formData.append("workMedia", media.url);
            }
          );
        } else if (Array.isArray(value)) {
          value.forEach((item) => {
            if (typeof item === "string" || typeof item === "number") {
              formData.append(key, String(item));
            }
          });
        } else if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            formData.append(`${key}.${nestedKey}`, String(nestedValue));
          });
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      // Send a POST request to the server
      const response = await fetch("/api/work/new", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Redirect to the shop page on success
        router.push(`/shop?id=${sessionData?.user?._id}`);
      } else {
        console.error(
          "Failed to publish work. Response status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error submitting work:", error);
    }
  };

  return (
    <div>
      {/* <Topbar /> */}
      <Form
        type="Edit"
        work={work}
        setWork={setWork}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Page;
