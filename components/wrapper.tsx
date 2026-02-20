"use client";
import React from "react";
import { useState } from "react";
import HamburgerMenu from "./FreelanceComponents/HamburgerMenu";

type Props = {};

const Wrapper = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <HamburgerMenu isOpen={isOpen} toggleNavbar={toggleNavbar} />
    </div>
  );
};

export default Wrapper;
