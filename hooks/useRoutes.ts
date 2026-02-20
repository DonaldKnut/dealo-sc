import { usePathname } from "next/navigation";
import useConversation from "./useConversation";
import { useMemo } from "react";
import { MessageSquare, LogOut, Users, Home } from "lucide-react";

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();

  const routes = useMemo(
    () => [
      {
        label: "Home",
        href: "/",
        icon: Home,
        active: pathname === "/",
        className: "text-green-300 hover:bg-green-500",
      },
      {
        label: "Chat",
        href: "/conversations",
        icon: MessageSquare,
        active: pathname === "/conversations" || Boolean(conversationId),
      },
      {
        label: "Users",
        href: "/users",
        icon: Users,
        active: pathname === "/users",
      },
      {
        label: "Logout",
        href: "/logout",
        icon: LogOut,
        active: pathname === "/logout",
      },
    ],
    [pathname, conversationId]
  );

  return routes;
};

export default useRoutes;
