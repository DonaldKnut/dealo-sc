import getConversations from "@/actions/getConversations";
import Sidebar from "../messenger/_components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

export const dynamic = "force-dynamic";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList initialItems={conversations} />
        {children}
      </div>
    </Sidebar>
  );
}
