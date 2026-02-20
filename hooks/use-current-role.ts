import { useSafeSession } from "@/hooks/use-safe-session";

export const useCurrentRole = () => {
  const session = useSafeSession();
  return session.data?.user?.role;
};
