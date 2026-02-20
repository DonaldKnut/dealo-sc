"use client";

// Force dynamic rendering for authentication
export const dynamic = "force-dynamic";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { useSafeSession } from "@/hooks/use-safe-session";
import Loader from "@/components/Loader";
import Form from "../marketplace/create-work/_components/Form";
import { Work } from "../marketplace/create-work/(data)/validationSchemas";

const UpdateWorkContent: React.FC = () => {
  const session = useSafeSession();
  const { data: sessionData } = session || {};
  const router = useRouter();

  const [work, setWork] = useState<Work>({
    category: "All",
    title: "",
    description: "",
    price: 0,
    workMedia: [],
    skills: [],
    deliveryDate: "",
    deliveryTime: "",
    contactInfo: { email: "", phone: "" },
    languagesSpoken: [],
    experienceLevel: "Junior",
    portfolioLink: "",
    certifications: [],
  });

  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const workId = searchParams.get("id");

  useEffect(() => {
    const fetchWorkDetails = async () => {
      if (!workId) return;

      try {
        const response = await fetch(`/api/work/${workId}`);
        const data = await response.json();

        setWork({
          category: data.category || "All",
          title: data.title || "",
          description: data.description || "",
          price: parseFloat(data.price) || 0,
          workMedia: data.workMedia || [],
          skills: data.skills || [],
          deliveryDate: data.deliveryDate || "",
          deliveryTime: data.deliveryTime || "",
          contactInfo: data.contactInfo || { email: "", phone: "" },
          languagesSpoken: data.languagesSpoken || [],
          experienceLevel: data.experienceLevel || "Junior",
          portfolioLink: data.portfolioLink || "",
          certifications: data.certifications || [],
        });

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch work details:", err);
        setLoading(false);
      }
    };

    fetchWorkDetails();
  }, [workId]);

  const handleSubmit = async (data: Work) => {
    try {
      const formData = new FormData();

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

      const response = await fetch(`/api/work/${workId}`, {
        method: "PATCH",
        body: formData,
      });

      if (response.ok) {
        router.push(`/shop?id=${sessionData?.user?._id}`);
      } else {
        console.error("Update failed with status:", response.status);
      }
    } catch (err: any) {
      console.error("Update Work failed:", err.message);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Form
        type="Edit"
        work={work}
        setWork={setWork}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

const UpdateWork: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdateWorkContent />
    </Suspense>
  );
};

export default UpdateWork;
