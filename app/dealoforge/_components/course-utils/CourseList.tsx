import { useState } from "react";
import CourseCard from "./CourseCard"; // Assuming this is the correct import path
import { Button } from "@/components/ui/button";

type Course = {
  _id: string;
  name: string;
  category: string;
  level: string;
  courseDuration: string;
  noOfChapters: number;
  courseBanner: string;
  createdBy: { firstName: string; avatar: string };
};

type CourseListProps = {
  courses: Course[];
  onDrop: (files: File[], courseId: string) => void;
  uploading: string | null;
  router: any;
  onAddCourse: () => void; // Triggered when adding a new course
};

const CourseList = ({
  courses,
  onDrop,
  uploading,
  router,
  onAddCourse,
}: CourseListProps) => {
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            onDrop={onDrop}
            uploading={uploading}
            router={router}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseList;
