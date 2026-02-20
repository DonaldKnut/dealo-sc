import Link from "next/link";
import clsx from "clsx";
import React from "react";

interface DesktopItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Corrected type for lucide-react icons
  active: boolean;
  onClick?: () => void;
}

const DesktopItem: React.FC<DesktopItemProps> = ({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}) => {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={clsx(
          "group flex flex-col leading-6 items-center justify-center w-full h-12 px-4 text-sm font-medium rounded-md",
          active
            ? "text-blue-600 bg-blue-100"
            : "text-gray-600 hover:bg-gray-200"
        )}
      >
        <Icon className="h-6 w-6 mb-1 shrink-0" />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
};

export default DesktopItem;
