import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineUserCircle } from "react-icons/hi";
import HamburgerMenu from "./HamburgerMenu";
import MobileMenu from "./MobileMenu";
import DesktopLinks from "./DesktopLinks";
import Submenu from "./Submenu";

interface NavbarProps {
  route: string;
  setOpen: (open: boolean) => void;
  open: boolean;
  activeItem: any;
  setRoute?: (route: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  route,
  setOpen,
  open,
  activeItem,
  setRoute,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const checkIfActive = () => {
    setIsActive(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", checkIfActive);
    return () => {
      window.removeEventListener("scroll", checkIfActive);
    };
  }, []);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`${isActive ? "bg-black/80 backdrop-blur-xl shadow-2xl border-b border-white/5" : "bg-[#323232]"
        } sticky top-0 z-[999] transition-all duration-300`}
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-4 relative z-[999] w-[89%]">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src="/dealo_logo.png"
                alt="Dealo's logo"
                className="cursor-pointer group-hover:scale-110 transition-transform duration-500"
                width={120}
                height={120}
              />
            </div>
            <span className="text-xl font-black text-white hidden sm:block tracking-tighter group-hover:text-emerald-400 transition-colors">
              DEALO <span className="text-emerald-500">SC</span>
            </span>
          </Link>
        </div>
        {/* Desktop Links */}
        <DesktopLinks setOpen={setOpen} setHoveredNav={setHoveredNav} />

        {/* Hamburger Menu */}
        <div className="md:hidden flex items-center space-x-4">
          <Link href="/sign-in">
            <HiOutlineUserCircle
              className="text-white text-2xl cursor-pointer hover:text-emerald-400 transition-colors"
              onClick={() => setOpen(true)}
            />
          </Link>
          <HamburgerMenu isOpen={isOpen} toggleNavbar={toggleNavbar} />
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && <MobileMenu />}

      {/* Submenu on Scroll with Dynamic Background */}
      {isActive && <Submenu hoveredNav={hoveredNav} />}
    </nav>
  );
};

export default Navbar;
