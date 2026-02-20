import { useSafeSession } from "@/hooks/use-safe-session";

export const useCurrentUser = () => {
  const session = useSafeSession();
  return session.data?.user;
};
