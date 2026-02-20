"use client";

import { useEffect, useState } from "react";
import WorkGrid from "./WorkGrid";
import Spinner from "@/spinner";
import { categories } from "../(dummy)/data"; // Adjust the path as necessary
import "../(styles)/Categories.scss";
import Home from "./Home";
import FeaturedPlans from "./FeaturedPlans";
import { Reveal } from "@/app/reveal";
import HighFidelityUI from "./HighFidelityUI";
import { Work } from "@/types/types";
import Link from "next/link"; // Import Link for navigation

const Feed: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [workList, setWorkList] = useState<Work[]>([]);

  const fetchWorks = async () => {
    try {
      const response = await fetch(`/api/work/all`);
      const result = await response.json();
      console.log("API Response:", result); // Debugging
      if (result.success) {
        setWorkList(result.data);
      } else {
        console.error("Failed to fetch works:", result.message);
      }
    } catch (error) {
      console.error("Failed to fetch work list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, [selectedCategory]);

  const filteredWorks =
    selectedCategory === "All"
      ? workList
      : workList.filter((work) => work.category === selectedCategory);

  // If there are no works, show a message and a button to create work
  if (!loading && filteredWorks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black p-4">
        <p className="text-lg text-gray-600 mb-4">No feeds available.</p>
        <Link
          href="/marketplace/create-work" // Replace with your actual create-work page path
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Create Work
        </Link>
      </div>
    );
  }

  return loading ? (
    <Spinner />
  ) : (
    <>
      <div className="categories">
        {categories.map((item, index) => (
          <p
            key={index}
            onClick={() => setSelectedCategory(item)}
            className={`${
              item === selectedCategory ? "selected text-white" : ""
            }`}
          >
            {item}
          </p>
        ))}
      </div>
      <Home />
      <Reveal>
        <WorkGrid data={filteredWorks} />
      </Reveal>
      <FeaturedPlans />
      <HighFidelityUI />
    </>
  );
};

export default Feed;
