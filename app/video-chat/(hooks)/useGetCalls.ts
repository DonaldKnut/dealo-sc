import { useEffect, useState } from "react";
import { useSafeSession } from "@/hooks/use-safe-session";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

export const useGetCalls = () => {
  const session = useSafeSession(); const { data: sessionData, status } = session || {}; // Use NextAuth's useSession
  const client = useStreamVideoClient();
  const [calls, setCalls] = useState<Call[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCalls = async () => {
      // Check if the client is ready and the user is authenticated
      if (!client || status === "loading" || !sessionData?.user?._id) return;

      setIsLoading(true);

      try {
        // Query the calls based on user ID
        const { calls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: sessionData?.user._id },
              { members: { $in: [sessionData?.user._id] } },
            ],
          },
        });

        setCalls(calls);
      } catch (error) {
        console.error("Error loading calls:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalls();
  }, [client, session, status, sessionData?.user, sessionData?.user._id]); // Dependencies updated to include session and status

  const now = new Date();

  const endedCalls = calls?.filter(({ state: { startsAt, endedAt } }: Call) => {
    return (startsAt && new Date(startsAt) < now) || !!endedAt;
  });

  const upcomingCalls = calls?.filter(({ state: { startsAt } }: Call) => {
    return startsAt && new Date(startsAt) > now;
  });

  return { endedCalls, upcomingCalls, callRecordings: calls, isLoading };
};
