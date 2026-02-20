"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Sidebar from "./sidebar";

const MobileSidebar = () => {
  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <Button variant="secondary" size="icon" className="md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
      </Sheet>
      <SheetContent>
        <Sidebar />
      </SheetContent>
    </div>
  );
};

export default MobileSidebar;
