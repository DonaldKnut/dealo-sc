import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const ProductImageGallery: React.FC<{
  images: string[];
  onImageClick: (index: number) => void;
}> = ({ images, onImageClick }) => {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <button
        onClick={() => router.push("/marketplace")}
        className="flex items-center text-gray-700 hover:text-black font-semibold mb-4"
      >
        <ChevronLeft size={20} className="mr-2" />
        Back to Marketplace
      </button>

      <div
        className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-[26px] overflow-hidden cursor-pointer"
        onClick={() => onImageClick(0)}
      >
        <Image
          src={images[0] || "/placeholder.png"}
          alt="Main Image"
          className="object-cover w-full h-full"
          height={620}
          width={620}
        />
      </div>
      <div className="flex space-x-4 overflow-x-auto h-[120px]">
        {images.map((photo, index) => (
          <Image
            key={index}
            src={photo || "/placeholder.png"}
            alt={`Thumbnail ${index + 1}`}
            className="rounded-lg cursor-pointer border border-gray-300"
            onClick={() => onImageClick(index)}
            height={120}
            width={120}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
