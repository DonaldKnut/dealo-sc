import Image from "next/image";
import { UserCircle2 } from "lucide-react";

type CourseCreatorProps = {
  createdBy: {
    firstName: string;
    avatar: string;
  };
};

export const CourseCreator = ({ createdBy }: CourseCreatorProps) => (
  <div className="mt-4 flex items-center gap-3">
    {createdBy.avatar ? (
      <Image
        src={createdBy.avatar}
        alt={createdBy.firstName}
        width={40}
        height={40}
        className="rounded-full"
      />
    ) : (
      <UserCircle2 size={40} className="text-gray-400" />
    )}
    <span className="text-sm">{createdBy.firstName}</span>
  </div>
);
