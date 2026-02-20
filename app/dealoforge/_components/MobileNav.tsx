"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "../(constants)";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const MobileNav = () => {
  const pathname = usePathname();
  const [userCredits, setUserCredits] = useState<number>(0);
  const maxCredits = 10; // Maximum credits allowed

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/credits");
        if (response.ok) {
          const data = await response.json();
          setUserCredits(data.credits);
        } else {
          console.error("Failed to fetch user credits");
        }
      } catch (error) {
        console.error("Error fetching user credits:", error);
      }
    };

    fetchCredits();
  }, []);

  const progressPercentage = (userCredits / maxCredits) * 100;

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src="/icons/hamburger.svg"
            width={36}
            height={36}
            alt="hamburger icon"
            className="cursor-pointer sm:hidden"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-[#4c6f55]">
          <Link href="/" className="flex items-center gap-1">
            <div className="text-[26px] font-extrabold text-white">
              <Image
                src="/forge.png"
                width={100}
                height={100}
                alt="dealo logo"
              />
            </div>
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-6 pt-16 text-white">
                {sidebarLinks.map((item) => {
                  const isActive = pathname === item.route;

                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        href={item.route}
                        key={item.label}
                        className={cn(
                          "flex gap-4 items-center p-4 rounded-lg w-full max-w-60",
                          {
                            "bg-blue-1": isActive,
                          }
                        )}
                      >
                        <Image
                          src={item.imgURL}
                          alt={item.label}
                          width={20}
                          height={20}
                        />
                        <p className="font-semibold">{item.label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>

            {/* Credits and Progress */}
            <div className="mt-auto p-4 text-white">
              <Progress value={progressPercentage} />
              <h4 className="pt-2 pb-2">{`${userCredits} out of ${maxCredits} credits remaining.`}</h4>
              <h5 className="text-xs text-gray-300">
                Upgrade your plan for Unlimited course Generation
              </h5>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
