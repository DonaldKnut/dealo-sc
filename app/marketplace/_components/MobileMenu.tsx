import React from "react";
import { IoSearchCircle } from "react-icons/io5";
import { Menu, X, Heart, Package, Store, Edit } from "lucide-react";
import Link from "next/link";
import { MdShoppingCart } from "react-icons/md";

type MobileMenuProps = {
  query: string;
  setQuery: (query: string) => void;
  searchWork: () => void;
  user: any;
  handleLogout: () => void;
};

// Define a type that extends React.FC to include displayName
type WithDisplayName = React.FC & { displayName?: string };

const MobileMenu = ({
  query,
  setQuery,
  searchWork,
  user,
  handleLogout,
}: MobileMenuProps) => (
  <div className="fixed inset-0 bg-[rgba(44,64,52,0.95)] h-[100vh] flex flex-col items-center gap-4 pt-20">
    <div className="relative mb-4 w-11/12">
      <input
        type="text"
        placeholder="What specific services?"
        onChange={(e) => setQuery(e.target.value)}
        className="px-6 py-3 rounded-full w-full bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#3b634b]"
      />
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#78ac76] hover:bg-[#386f37] text-white hover:text-[#4fec5c] px-4 py-2 rounded-full flex items-center gap-2"
        onClick={searchWork}
        disabled={query === ""}
      >
        Search <IoSearchCircle size={24} color="white" />
      </button>
    </div>

    <nav className="flex flex-col gap-4">
      <Link
        href="/marketplace/wishlist"
        className="text-white flex items-center gap-2"
      >
        <Heart size={20} /> Wishlist
      </Link>
      <Link
        href="/marketplace/cart"
        className="text-white flex items-center gap-2"
      >
        <MdShoppingCart size={20} /> Cart
      </Link>
      <Link
        href="/marketplace/order"
        className="text-white flex items-center gap-2"
      >
        <Package size={20} /> Orders
      </Link>
      <Link
        href={`/marketplace/shop?id=${user?._id}`}
        className="text-white flex items-center gap-2"
      >
        <Store size={20} /> Your Shop
      </Link>
      <Link
        href="/marketplace/create-work"
        className="text-white flex items-center gap-2"
      >
        <Edit size={20} /> Sell Your Work
      </Link>
      {user ? (
        <button
          onClick={handleLogout}
          className="text-white flex items-center gap-2"
        >
          <X size={20} /> Log Out
        </button>
      ) : (
        <>
          <Link href="/sign-in" className="text-white">
            Log In
          </Link>
                          <Link href="/sign-in" className="text-white">
            Sign Up
          </Link>
        </>
      )}
    </nav>
  </div>
);

const MenuIcon: WithDisplayName = () => (
  <Menu size={28} className="text-white" />
);
MenuIcon.displayName = "MobileMenu.MenuIcon";

const CloseIcon: WithDisplayName = () => <X size={28} className="text-white" />;
CloseIcon.displayName = "MobileMenu.CloseIcon";

MobileMenu.MenuIcon = MenuIcon;
MobileMenu.CloseIcon = CloseIcon;

export default MobileMenu;
