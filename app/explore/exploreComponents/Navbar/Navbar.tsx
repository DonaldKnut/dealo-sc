"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/constant";
import Button from "../Button/Button";
import { FaSquareArrowUpRight } from "react-icons/fa6";
import { CgMenuRound } from "react-icons/cg";
import { RiCloseCircleFill } from "react-icons/ri";

type Props = {};

const Navbar = (props: Props) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const toggleMenu = () => setMenuOpened(!menuOpened);

  return (
    <nav className="flex items-center justify-between max-container px-12 z-30 py-2 h-[80px] shadow-xl rounded-full ring-offset-green-500 fixed w-[95%] left-[50%] top-1 translate-x-[-50%] bg-green-900/50 backdrop-blur-md bg-opacity-30 text-white">
      <Link href="/" passHref>
        <Image
          src="/dealo_logo.png"
          alt="dealo travels logo"
          width={90}
          height={90}
        />
      </Link>
      <ul className="hidden lg:flex h-full space-x-8">
        {NAV_LINKS.map((link) => (
          <li key={link.key} className="flex items-center plaifair-italic">
            <a href={link.href}>
              <div className="flex items-center transition-all duration-500 ease-in-out hover:text-green-500">
                {link.icon}
                <span className="ml-2">{link.label}</span>
                <span className="inline-block absolute h-[2px] w-0 bg-green-500 -bottom-2 transition-all duration-500 group-hover:w-full"></span>
              </div>
            </a>
          </li>
        ))}
      </ul>
      <div className="hidden lg:block">
        <Button
          type="button"
          title="Apply Now"
          icon={<FaSquareArrowUpRight />}
          variant="btn_green_rounded"
          to="/apply"
        />
      </div>
      {!menuOpened ? (
        <CgMenuRound
          className="lg:hidden inline-block cursor-pointer"
          style={{ fontSize: "35px" }}
          onClick={toggleMenu}
        />
      ) : (
        <RiCloseCircleFill
          className="lg:hidden inline-block cursor-pointer"
          style={{ fontSize: "35px" }}
          onClick={toggleMenu}
        />
      )}
      <ul
        className={`${
          menuOpened
            ? "flex flex-col justify-center p-12 w-64 fixed top-24 right-0 transition-all duration-500 text-center"
            : "flex flex-col justify-center p-12 w-64 fixed top-24 right-[-100%] transition-all duration-500 text-center"
        } bg-green-900/50 border border-green-400/30 shadow-emerald-450 rounded-lg`}
      >
        {NAV_LINKS.map((link) => (
          <li key={link.key} className="flex items-center mb-9">
            <Link href={link.href} passHref>
              <div className="flex items-center transition-all duration-500 ease-in-out hover:underline">
                {link.icon}
                <span className="ml-2 text-lg">{link.label}</span>
                <span className="inline-block absolute h-[2px] w-0 bg-green-500 -bottom-2 transition-all duration-500 group-hover:w-full"></span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
