import { useSession } from "next-auth/react";

/**
 * Safe useSession hook that prevents destructuring errors during static generation
 * This is the root cause fix for the "Cannot destructure property 'data'" error
 * while preserving the original useSession behavior for client-side rendering
 */
export const useSafeSession = () => {
  try {
    const session = useSession();

    // If session is undefined (during SSR/static generation), return loading state
    if (typeof session === "undefined") {
      return {
        data: null,
        status: "loading" as const,
        update: () => Promise.resolve(null),
      };
    }

    // If session is null, user is not authenticated
    if (session === null) {
      return {
        data: null,
        status: "unauthenticated" as const,
        update: () => Promise.resolve(null),
      };
    }

    return session;
  } catch (error) {
    console.error("useSafeSession error:", error);
    // If SessionProvider is not available yet or there's a configuration error, return unauthenticated state
    return {
      data: null,
      status: "unauthenticated" as const,
      update: () => Promise.resolve(null),
    };
  }
};
