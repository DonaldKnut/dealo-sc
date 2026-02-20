"use client";

import useConversation from "@/actions/useConversation";
import { FullConversationType } from "@/types/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ConversationListProps {
  initialItems: FullConversationType[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
}) => {
  const [items, setItems] = useState(initialItems);
  const router = useRouter();
  const { conversationId, isOpen } = useConversation();
  return (
    <aside
      className={clsx(
        `fixed inset-y-0 pb-20 bg-white lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200`,
        isOpen ? `hidden` : `block w-full left-0`
      )}
    >
      <div className="px-5">
        <div className="flex justify-between mb-4 pt-4">Messages</div>
      </div>
    </aside>
  );
};

export default ConversationList;
