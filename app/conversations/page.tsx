"use client";

import useConversation from "@/hooks/useConversation";
import clsx from "clsx";
import EmptyState from "../messenger/_components/EmptyState"

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
;

const Home = () => {
  const { isOpen } = useConversation();

  return (
    <>
      <div
        className={clsx(
          "lg:pl-80 h-full lg:block",
          isOpen ? "block" : "hidden"
        )}
      >
        <EmptyState />
      </div>
    </>
  );
};

export default Home;
