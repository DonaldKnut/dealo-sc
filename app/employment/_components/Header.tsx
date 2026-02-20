"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TfiWrite } from "react-icons/tfi";
import { FaUserCircle } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { LayoutDashboard, MessageCircle } from "lucide-react";
import { signIn } from "next-auth/react";

interface HeaderProps {
  user: any;
  signInUrl: string;
  onLogout: () => Promise<void>;
}

function Header({ user, signInUrl, onLogout }: HeaderProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScroll = () => {
    setIsSticky(window.scrollY > 100);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full ${
        isSticky ? "sticky top-0 z-50 backdrop-blur-lg" : ""
      } transition-all duration-500 ease-in-out`}
    >
      <div
        className={`flex justify-between items-center p-4 text-white ${
          isSticky ? "bg-[#445944da] border border-white/20 shadow-lg" : ""
        } transition-colors duration-300`}
      >
        <div className="flex justify-between items-center p-4 w-[85%] m-auto">
          {/* Logo Section */}
          <Link href="/" className="font-bold text-xl">
            <Image
              src="/dealo_logo.png"
              alt="Dealo Icon"
              width={120}
              height={120}
            />
          </Link>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              className="text-white text-3xl focus:outline-none"
            >
              {isMenuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>

          {/* Navigation Section */}
          <nav className="hidden md:flex items-center gap-4">
            {!user && (
              <Link
                href="/sign-in"
                className="rounded-md bg-white/30 backdrop-blur-sm border border-white/20 py-1 px-2 sm:py-2 sm:px-4 hover:bg-white/50 transition-all"
              >
                Login
              </Link>
            )}

            {user && (
              <>
                {/* Dashboard Button */}
                <Link
                  href="/dealoforge/dashboard"
                  className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300"
                >
                  <LayoutDashboard size={28} />
                </Link>

                {/* Messaging Icon */}
                <Link
                  href="/messenger"
                  className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300"
                >
                  <MessageCircle size={28} />
                </Link>

                {/* User Profile
                <Link
                  href="/dealoforge/dashboard"
                  className="flex items-center gap-2"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={`${user.name}'s profile`}
                      width={40}
                      height={40}
                      className="rounded-full border border-white/20"
                    />
                  ) : (
                    <FaUserCircle size={30} />
                  )}
                </Link> */}

                {/* Post a Job Button */}
                <Link
                  href="/employment/new-listing"
                  className="flex items-center gap-2 rounded-md py-1 px-2 sm:py-2 sm:px-4 bg-white/30 border border-white/20 backdrop-blur-sm hover:bg-white/50 transition-all text-white"
                >
                  Post a job <TfiWrite />
                </Link>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="rounded-md bg-white/30 border border-white/20 py-1 px-2 sm:py-2 sm:px-4 backdrop-blur-sm hover:bg-white/50 transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-6 text-white">
          {/* Close Button */}
          <button
            onClick={toggleMenu}
            aria-label="Close navigation menu"
            className="absolute top-4 right-4 text-4xl text-white bg-black/50 rounded-full p-2 focus:outline-none hover:bg-white hover:text-black transition-all"
          >
            <HiX />
          </button>

          {!user && (
            <Link
              href="/sign-in"
              className="rounded-md bg-white/30 backdrop-blur-sm border border-white/20 py-2 px-6 hover:bg-white/50 transition-all"
            >
              Login
            </Link>
          )}
          {user && (
            <>
              {/* Dashboard Button */}
              <Link
                href="/dealoforge/dashboard"
                className="flex items-center gap-2 text-xl"
                onClick={toggleMenu}
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={`${user.name}'s profile`}
                    width={50}
                    height={50}
                    className="rounded-full border border-white/20"
                  />
                ) : (
                  <FaUserCircle size={40} />
                )}
                Dashboard
              </Link>

              {/* Messaging Icon */}
              <Link
                href="/messenger"
                className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300"
                onClick={toggleMenu}
              >
                <MessageCircle size={28} />
              </Link>

              {/* Post a Job Button */}
              <Link
                href="/employment/new-listing"
                className="flex items-center gap-2 rounded-md py-2 px-6 bg-white/30 border border-white/20 backdrop-blur-sm hover:bg-white/50 transition-all text-white"
                onClick={toggleMenu}
              >
                Post a job <TfiWrite />
              </Link>

              {/* Logout Button */}
              <button
                onClick={() => {
                  toggleMenu();
                  onLogout();
                }}
                className="rounded-md bg-white/30 border border-white/20 py-2 px-6 backdrop-blur-sm hover:bg-white/50 transition-all"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
