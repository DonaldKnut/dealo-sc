"use client";
import { motion } from "framer-motion";
import CourseActions from "./CourseActions";
import { CourseBanner } from "../_courseComponents/CourseBanner";
import { CourseInfo } from "../_courseComponents/CourseInfo";

type Course = {
  _id: string;
  name: string;
  category: string;
  level: string;
  courseDuration: string;
  noOfChapters: number;
  courseBanner: string;
  createdBy: {
    firstName: string;
    avatar: string;
  };
};

type CourseCardProps = {
  course: Course;
  onDrop: (files: File[], courseId: string) => void;
  uploading: string | null;
  router: any;
};

const CourseCard = ({ course, onDrop, uploading, router }: CourseCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-[#1E1E1E] rounded-xl shadow-lg transition-shadow p-6"
    >
      <CourseBanner course={course} onDrop={onDrop} uploading={uploading} />
      <CourseInfo course={course} />
      <CourseActions course={course} router={router} />
    </motion.div>
  );
};

export default CourseCard;
