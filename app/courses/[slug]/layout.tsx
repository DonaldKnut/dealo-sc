import { generateMetadata } from "./metadata";
import { ReactNode } from "react";

export { generateMetadata };

interface LayoutProps {
  children: ReactNode;
}

export default function CourseLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
