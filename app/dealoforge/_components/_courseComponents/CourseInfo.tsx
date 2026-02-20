import { CourseDetail } from "./CourseDetail";
import { CourseCreator } from "./CourseCreator";
import { Tag, Layers, Clock, BookOpen } from "lucide-react";

type CourseInfoProps = {
  course: any;
};

export const CourseInfo = ({ course }: CourseInfoProps) => {
  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold">{course.name}</h3>
      <ul className="mt-3 text-sm space-y-2">
        <CourseDetail
          icon={<Tag size={16} />}
          label="Category"
          value={course.category}
        />
        <CourseDetail
          icon={<Layers size={16} />}
          label="Level"
          value={course.level}
        />
        <CourseDetail
          icon={<Clock size={16} />}
          label="Duration"
          value={course.courseDuration}
        />
        <CourseDetail
          icon={<BookOpen size={16} />}
          label="Chapters"
          value={course.noOfChapters.toString()}
        />
      </ul>
      <CourseCreator createdBy={course.createdBy} />
    </div>
  );
};
