"use client";

import { useSafeSession } from "@/hooks/use-safe-session";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import CourseList from "./course-utils/CourseList";
import { onDrop } from "./course-utils/courseUtils";
import Header from "./course-utils/Header";

type Course = {
  _id: string;
  name: string;
  category: string;
  level: string;
  courseDuration: string;
  noOfChapters: number;
  courseBanner: string;
  createdBy: { firstName: string; avatar: string; id: string };
};

const AddCourse = () => {
  const session = useSafeSession(); const { data: sessionData } = session || {};
  const user = sessionData?.user;
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/courses");
      setCourses(response.data.data);
      console.log(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="container mx-auto px-6 py-10 bg-[#292929] text-white min-h-screen rounded-[13px]">
      <Header userName={user?.name || "Guest"} />
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-10"
      >
        <h2 className="text-3xl font-bold mb-6">Your Courses</h2>
        {loading && <p>Loading courses...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && courses.length === 0 && (
          <p className="text-gray-400 text-lg">
            No courses found. Start creating one!
          </p>
        )}
        <CourseList
          courses={courses}
          onDrop={(files, courseId) => onDrop(files, courseId, setUploading)}
          uploading={uploading}
          router={router}
          onAddCourse={() => router.push("/dealoforge/create-course")} // Directly navigates to the creation page
        />
      </motion.section>
    </div>
  );
};

export default AddCourse;
