import React from "react";
import { Star } from "lucide-react";
import Image from "next/image";

interface Work {
  title: string;
  creator?: {
    firstName: string;
    lastName: string;
  };
}

const ProductHeader: React.FC<{ work: Work }> = ({ work }) => (
  <>
    <h1 className="text-3xl font-bold text-green-900 mb-2 flex items-center gap-2">
      <Star className="text-green-600" />
      {work.title}
    </h1>
    <div className="text-sm text-gray-600 flex items-center gap-2">
      <Image
        src="/user.png"
        alt="Creator Icon"
        width={30}
        height={30}
        className="rounded-full"
      />
      <span>
        Created by{" "}
        {work.creator
          ? `${work.creator.firstName} ${work.creator.lastName}`
          : "Unknown"}
      </span>
    </div>
  </>
);

export default ProductHeader;
