import Link from "next/link";
import clsx from "clsx";
import React from "react";

interface MobileItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // lucide-react icon type
  active: boolean;
}

const MobileItem: React.FC<MobileItemProps> = ({
  href,
  label,
  icon: Icon,
  active,
}) => {
  return (
    <Link
      href={href}
      className={clsx(
        "group flex flex-col items-center justify-center w-full text-sm font-medium",
        active ? "text-blue-600" : "text-gray-600 hover:text-black"
      )}
    >
      <Icon className="h-6 w-6 mb-1" />
      <span className="sr-only">{label}</span>
    </Link>
  );
};

export default MobileItem;
