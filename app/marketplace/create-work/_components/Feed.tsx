"use client";

import { categories } from "../(data)/data";
import WorkList from "./WorkList";
import { useEffect, useState, useCallback } from "react";
import Spinner from "../../../../spinner";

const Feed = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [workList, setWorkList] = useState([]);

  const getWorkList = useCallback(async () => {
    setLoading(true); // Ensure loading is shown when switching categories
    const response = await fetch(`/api/work/list/${selectedCategory}`);
    const data = await response.json();
    setWorkList(data);
    setLoading(false);
  }, [selectedCategory]);

  useEffect(() => {
    getWorkList();
  }, [getWorkList]);

  return loading ? (
    <Spinner />
  ) : (
    <>
      <div className="flex flex-wrap items-center justify-center gap-12 py-5 px-8 mb-14 border-y border-black">
        {categories?.map((item, index) => (
          <p
            onClick={() => setSelectedCategory(item)}
            className={`font-semibold text-lg cursor-pointer ${
              item === selectedCategory ? "text-pink-500" : ""
            } hover:text-pink-500`}
            key={index}
          >
            {item}
          </p>
        ))}
      </div>

      <WorkList data={workList} />
    </>
  );
};

export default Feed;
