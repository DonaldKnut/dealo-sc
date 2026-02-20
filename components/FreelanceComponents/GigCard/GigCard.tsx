import React from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { FaKissWinkHeart } from "react-icons/fa";
import images from "@/public/assets/images";
import Image from "next/image";

interface GigCardProps {
  item: {
    id: number;
    img: string;
    pp: string;
    username: string;
    desc: string;
    star: number;
    price: number;
  };
}

const GigCard: React.FC<GigCardProps> = ({ item }) => {
  return (
    <div className="gig-card">
      <Link href={`/gigs/${item.id} anchor-link`} passHref>
        <div className="pp_image">
          {/* Replace <img> with <Image> for better optimization */}
          <Image
            src={item.img}
            alt="image of a gig"
            className="bg-picture"
            width={300} // Set the width
            height={200} // Set the height
            layout="intrinsic" // You can also use "fill" or "responsive" depending on your layout
          />
        </div>
        <div className="info">
          <div className="user">
            <Image
              src={item.pp}
              alt="user profile"
              className="user-picture"
              width={50} // Set the width
              height={50} // Set the height
            />
            <span>{item.username}</span>
          </div>
          <p className="gig-desc">{item.desc}</p>
          <div className="kisses_wrapper">
            <FaKissWinkHeart className="kisses" />
            <span>{item.star}</span>
          </div>
        </div>
        <hr />
        <div className="details">
          <div className="star-icon">
            <i className="fa-solid fa-heart"></i>
          </div>
          <div className="item-price">
            <span>Starting At</span>
            <p className="pricing">
              <span>
                <Image
                  src={images.cash}
                  alt="image of a cash icon"
                  className="cash-icon"
                  width={50} // Set the width
                  height={50} // Set the height
                />
              </span>
              ${item.price}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default GigCard;
