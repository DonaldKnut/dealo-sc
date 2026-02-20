import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Delete,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import { useSafeSession } from "@/hooks/use-safe-session";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ObjectId } from "bson";
import Image from "next/image";

interface WorkProps {
  work: {
    _id: string | ObjectId;
    title: string;
    category: string;
    price: number;
    creator: {
      _id: string | ObjectId;
      username: string;
      profileImagePath: string;
    };
    workPhotoPaths: string[];
  };
}

const WorkCard: React.FC<WorkProps> = ({ work }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const session = useSafeSession();
  const { data: sessionData, update } = session || {};
  const router = useRouter();

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

  const handleDelete = async () => {
    const hasConfirmed = confirm("Are you sure you want to delete this work?");
    if (hasConfirmed) {
      try {
        await fetch(`/api/work/${work._id}`, { method: "DELETE" });
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const userId = sessionData?.user?._id;

  const patchWishlist = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    const response = await fetch(`/api/user/${userId}/wishlist/${work._id}`, {
      method: "PATCH",
    });
    const data = await response.json();
    update({ user: { wishlist: data.wishlist } });
  };

  return (
    <div
      className="relative p-4 rounded-lg cursor-pointer hover:shadow-lg bg-white"
      onClick={() => router.push(`/work-details?id=${work._id}`)}
    >
      <div className="relative w-full h-64 overflow-hidden rounded-lg mb-4">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {work.workPhotoPaths.map((photo, index) => (
            <div key={index} className="flex-shrink-0 w-full h-full relative">
              <Image
                src={photo}
                alt="work"
                className="w-full h-full object-cover"
              />
              <button
                className="absolute top-1/2 left-2 transform -translate-y-1/2 p-1 rounded-full bg-white text-black hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevSlide();
                }}
              >
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </button>
              <button
                className="absolute top-1/2 right-2 transform -translate-y-1/2 p-1 rounded-full bg-white text-black hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextSlide();
                }}
              >
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-semibold">{work.title}</h3>
          <div className="flex items-center gap-2">
            <Image
              src={work.creator.profileImagePath}
              alt="creator"
              className="w-10 h-10 rounded-full"
            />
            <span className="font-medium">{work.creator.username}</span> in{" "}
            <span className="text-gray-500">{work.category}</span>
          </div>
        </div>
        <div className="bg-blue-100 px-3 py-1 rounded-full text-blue-700 font-bold">
          ${work.price}
        </div>
      </div>

      {userId === work.creator._id ? (
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-red-100"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <Delete sx={{ fontSize: "24px" }} />
        </button>
      ) : (
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-red-100"
          onClick={(e) => {
            e.stopPropagation();
            patchWishlist();
          }}
        >
          {/* Favorite button will always show the border for now */}
          <FavoriteBorder sx={{ fontSize: "24px" }} />
        </button>
      )}
    </div>
  );
};

export default WorkCard;
