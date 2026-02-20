/**
 * Barrel export for shared/common components
 * Import components from here: import { Button, Input } from "@/components"
 */

// UI Components (shadcn/ui)
export * from "./ui/button";
export * from "./ui/input";
export * from "./ui/card";
export * from "./ui/dialog";
export * from "./ui/dropdown-menu";
export * from "./ui/form";
export * from "./ui/label";
export * from "./ui/select";
export * from "./ui/textarea";
export * from "./ui/toast";
export * from "./ui/use-toast";

// Shared Components
export { default as Header } from "./Header";
export { default as Footer } from "./Footer";
export { default as ErrorBoundary } from "./ErrorBoundary";
export { default as EmptyState } from "./EmptyState";
export { default as Loader } from "./Loader";
export { StatCard } from "./StatCard";

// Form Components
export { default as FileUploader } from "./FileUploader";
export * from "./forms/_components/FileUpload";
export * from "./forms/_components/TextInput";
export * from "./forms/_components/SelectInput";

// Dashboard Components
export { default as Sidebar } from "./dashboard/Sidebar";
export { default as AdminDashboard } from "./dashboard/AdminDashboard";
export { default as StudentDashboard } from "./dashboard/StudentDashboard";
export { default as InstructorDashboard } from "./dashboard/InstructorDashboard";

// Home Components
export { default as StatsSection } from "./home/StatsSection";
export { default as LearningHero } from "./home/LearningHero";

// Layout Components
export { default as SectionWrapper } from "./layouts/SectionWrapper";

// Common Components
export { default as ClientOnly } from "./common/ClientOnly";



