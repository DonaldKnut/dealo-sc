import Image from "next/image";
import { FileVideo } from "lucide-react";
import { ClipLoader } from "react-spinners";

type CourseBannerProps = {
  course: any;
  onDrop: (files: File[], courseId: string) => void;
  uploading: string | null;
};

export const CourseBanner = ({
  course,
  onDrop,
  uploading,
}: CourseBannerProps) => {
  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      onDrop(Array.from(event.target.files), course._id);
    }
  };

  return (
    <div
      className="relative w-full h-44 rounded-lg overflow-hidden cursor-pointer"
      onClick={() =>
        document.getElementById(`fileInput-${course._id}`)?.click()
      }
    >
      {uploading === course._id ? (
        <div className="flex items-center justify-center w-full h-full bg-[#1e4a1e]">
          <ClipLoader color="#00FF7F" />
        </div>
      ) : course.courseBanner ? (
        <Image
          src={course.courseBanner}
          alt={`${course.name} banner`}
          fill
          className="object-cover"
        />
      ) : (
        <div className="bg-green-800 flex items-center justify-center w-full h-full">
          <FileVideo size={50} className="text-green-500" />
        </div>
      )}
      <input
        id={`fileInput-${course._id}`}
        type="file"
        className="hidden"
        onChange={handleFileInputChange}
      />
    </div>
  );
};
