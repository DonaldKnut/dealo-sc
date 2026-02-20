"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MobileNav from "../_components/MobileNav"
import { useSafeSession } from "@/hooks/use-safe-session";
;
import {
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  UserRound,
} from "lucide-react";

const Navbar = () => {
  const session = useSafeSession(); const { data: sessionData } = session || {};
  const user = sessionData?.user;
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const userInitial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <nav className="flex-between fixed z-50 w-full bg-[#2e2f2e] px-6 py-4 lg:px-10 shadow-sm">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Image
            src="/dealo_logo.png"
            alt="Dealo"
            width={120}
            height={120}
            className="w-12 h-12 lg:w-16 lg:h-16"
          />
          <span className="text-lg font-bold text-white hidden sm:block">
            Dealo
          </span>
        </div>
      </Link>

      <div className="flex-between gap-5">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="p-0 rounded-full hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-green-500 group"
                >
                  <Avatar className="h-9 w-9 border-2 border-gray-400 group-hover:border-green-400 transition-colors">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback className="bg-gray-600 text-white font-medium text-lg">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </Button>
                <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-green-400 transition-colors" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-[#3a3b3a] border-green-600 rounded-md shadow-lg"
              align="end"
            >
              <DropdownMenuItem
                className="cursor-pointer hover:bg-green-700 focus:bg-green-700 text-white gap-2"
                onClick={() => router.push("/dashboard")}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer hover:bg-green-700 focus:bg-green-700 text-white gap-2"
                onClick={() => router.push("/settings")}
              >
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-red-400 hover:bg-green-700 focus:bg-green-700 gap-2"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/sign-in">
            <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
              <UserRound className="h-4 w-4" />
              Get Started
            </Button>
          </Link>
        )}

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
