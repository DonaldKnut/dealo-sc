import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

type HeaderProps = {
  userName?: string;
};

const Header = ({ userName }: HeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex justify-between items-center"
  >
    <div>
      <h1 className="font-bold playfair-italic text-5xl">
        Hello, <span className="text-[#00FF7F]">{userName}</span>
      </h1>
      <p className="text-gray-400 mt-2 text-lg">
        Create a new course with AI, share it with friends, and earn from it.
      </p>
    </div>
    <Link href="/dealoforge/create-course">
      <Button className="bg-[#01924a] flex items-center gap-2 text-xl hover:bg-[#00cc6f]">
        Create Course <ChevronRight />
      </Button>
    </Link>
  </motion.div>
);

export default Header;
