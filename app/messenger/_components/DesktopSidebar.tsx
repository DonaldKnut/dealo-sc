"use client";

import useRoutes from "@/hooks/useRoutes";
import useConversation from "@/hooks/useConversation";
import DesktopItem from "./DesktopItem";
import Avatar from "./Avatar";

interface DesktopSidebarProps {
  currentUser: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentUser }) => {
  const routes = useRoutes();
  const { isOpen } = useConversation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between">
      <nav className="mt-4 flex flex-col justify-between">
        <ul role="list" className="flex flex-col items-center space-y-1">
          {routes.map((item) => (
            <DesktopItem
              key={item.label}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={item.active}
              onClick={() => console.log("Item clicked")}
            />
          ))}
        </ul>
      </nav>

      {/* Example of using currentUser */}
      {/* <div className="mt-4 text-center">
        <p className="text-sm font-medium text-gray-600">
          Logged in as: {currentUser.name || currentUser.email}
        </p>
      </div> */}

      <nav className="mt-4 flex flex-col justify-between items-center">
        <div className="cursor-pointer hover:opacity-75 transition">
          <Avatar user={currentUser} />
        </div>
      </nav>
    </div>
  );
};

export default DesktopSidebar;
