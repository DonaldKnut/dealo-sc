import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiFillDelete,
  AiFillHeart,
  AiOutlineHeart,
} from "react-icons/ai";
import { useSafeSession } from "@/hooks/use-safe-session";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

// Define the types for the props
interface Avatar {
  url: string; // URL field in Avatar
}

interface Creator {
  _id: string;
  name: string;
  avatar?: Avatar; // Avatar is optional
}

interface Work {
  _id: string;
  title: string;
  price: number;
  category: string;
  workPhotoPaths: string[];
  creator: Creator;
}

interface WorkCardProps {
  work: Work;
}

const WorkCard: React.FC<WorkCardProps> = ({ work }) => {
  /* SLIDER FOR PHOTOS */
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const goToNextSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % work.workPhotoPaths.length
    );
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + work.workPhotoPaths.length) %
        work.workPhotoPaths.length
    );
  };

  const router = useRouter();

  /* DELETE WORK */
  const handleDelete = async () => {
    const hasConfirmed = confirm("Are you sure you want to delete this work?");

    if (hasConfirmed) {
      try {
        await fetch(`/api/work/${work._id}`, {
          method: "DELETE",
        });
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const session = useSafeSession();
  const { data: sessionData, update } = session || {};
  const userId = sessionData?.user?._id;

  /* ADD TO WISHLIST */
  const wishlist = sessionData?.user?.wishlist as Work[] | undefined;

  const isLiked = wishlist?.some((item) => item._id === work._id);

  const patchWishlist = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    const response = await fetch(`/api/user/${userId}/wishlist/${work._id}`, {
      method: "PATCH",
    });
    const data = await response.json();
    update({ user: { wishlist: data.wishlist } }); // update session
  };

  return (
    <div
      className="p-4 bg-green-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={() => {
        router.push(`/work-details?id=${work._id}`);
      }}
    >
      <div className="relative">
        <div className="overflow-hidden rounded-lg">
          {work.workPhotoPaths?.map((photo, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                currentIndex === index
                  ? "transform translate-x-0"
                  : "transform translate-x-full"
              }`}
            >
              <Image
                src={photo}
                alt="work"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
        <div
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-green-200 p-2 rounded-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            goToPrevSlide();
          }}
        >
          <AiOutlineArrowLeft className="text-green-700" />
        </div>
        <div
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-green-200 p-2 rounded-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            goToNextSlide();
          }}
        >
          <AiOutlineArrowRight className="text-green-700" />
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-green-800">{work.title}</h3>
          <div className="flex items-center text-green-600">
            <Image
              src={work.creator.avatar?.url || "/default-profile.png"} // Safe access with fallback
              alt="creator"
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="font-medium">{work.creator.name}</span> in{" "}
            <span>{work.category}</span>
          </div>
        </div>
        <div className="text-green-900 font-bold">${work.price}</div>
      </div>

      {userId === work.creator._id ? (
        <div
          className="mt-2 p-2 bg-green-200 rounded-full cursor-pointer flex justify-center items-center"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <AiFillDelete className="text-green-700" size={24} />
        </div>
      ) : (
        <div
          className="mt-2 p-2 bg-green-200 rounded-full cursor-pointer flex justify-center items-center"
          onClick={(e) => {
            e.stopPropagation();
            patchWishlist();
          }}
        >
          {isLiked ? (
            <AiFillHeart className="text-red-500" size={24} />
          ) : (
            <AiOutlineHeart className="text-green-700" size={24} />
          )}
        </div>
      )}
    </div>
  );
};

export default WorkCard;
