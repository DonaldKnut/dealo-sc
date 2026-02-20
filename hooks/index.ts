/**
 * Barrel export for all hooks
 * Import hooks from here: import { useSafeSession, useR2Upload } from "@/hooks"
 */

// Auth hooks
export { useSafeSession } from "./use-safe-session";
export { useCurrentUser } from "./use-current-user";
export { useCurrentRole } from "./use-current-role";

// Storage hooks
export { default as useLocalStorage } from "./useLocalStorage";

// Feature hooks
export { default as useConversation } from "./useConversation";
export { usePayment } from "./usePayment";
export { useR2Upload } from "./useR2Upload";
export { default as useRoutes } from "./useRoutes";

// UI hooks
export { default as useColorMode } from "./useColorMode";

// Utility hooks
export { useApi } from "./useApi";
export { useAsync } from "./useAsync";
export { useDebounce } from "./useDebounce";
export { useToggle } from "./useToggle";
export { useClickOutside } from "./useClickOutside";
export { useScroll, useScrollThreshold } from "./useScroll";
export { useFetch } from "./useFetch";
export { useLocalStorageSync } from "./useLocalStorageSync";
export { useMounted } from "./useMounted";

// Feature hooks
export { useMessages } from "./useMessages";
export { useResumes } from "./useResumes";
export { useHomePageData } from "./useHomePageData";
