import Link from "next/link";
import { Heart, Package, Store, Edit, X } from "lucide-react";
import { MdShoppingCart } from "react-icons/md";

type UserMenuProps = {
  user: any;
  handleLogout: () => void;
};

const UserMenu = ({ user, handleLogout }: UserMenuProps) => (
  <div className="absolute right-10 top-16 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
    {!user ? (
      <div className="flex flex-col p-2">
        <Link href="/sign-in" className="hover:bg-gray-100 px-4 py-2">
          Log In
        </Link>
                    <Link href="/sign-in" className="hover:bg-gray-100 px-4 py-2">
          Sign Up
        </Link>
      </div>
    ) : (
      <div className="flex flex-col p-2">
        <Link
          href="/marketplace/wishlist"
          className="hover:bg-gray-100 px-4 py-2 flex items-center gap-2"
        >
          <Heart size={16} /> Wishlist
        </Link>
        <Link
          href="/marketplace/cart"
          className="hover:bg-gray-100 px-4 py-2 flex items-center gap-2"
        >
          <MdShoppingCart size={16} /> Cart
        </Link>
        <Link
          href="/marketplace/order"
          className="hover:bg-gray-100 px-4 py-2 flex items-center gap-2"
        >
          <Package size={16} /> Orders
        </Link>
        <Link
          href={`/marketplace/shop?id=${user.id}`}
          className="hover:bg-gray-100 px-4 py-2 flex items-center gap-2"
        >
          <Store size={16} /> Your Shop
        </Link>
        <Link
          href="/marketplace/create-work"
          className="hover:bg-gray-100 px-4 py-2 flex items-center gap-2"
        >
          <Edit size={16} /> Sell Your Work
        </Link>
        <button
          onClick={handleLogout}
          className="hover:bg-gray-100 px-4 py-2 text-left flex items-center gap-2"
        >
          <X size={16} /> Log Out
        </button>
      </div>
    )}
  </div>
);

export default UserMenu;
