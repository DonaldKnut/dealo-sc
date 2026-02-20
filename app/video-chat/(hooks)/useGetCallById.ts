import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

export const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client) {
      setIsCallLoading(false);
      return;
    }

    const loadCall = async () => {
      try {
        // https://getstream.io/video/docs/react/guides/querying-calls/#filters
        const { calls } = await client.queryCalls({
          filter_conditions: { id },
        });

        if (calls.length > 0) {
          setCall(calls[0]);
        } else {
          // If no call found, create a new one
          const newCall = client.call("default", id as string);
          await newCall.getOrCreate({
            data: {
              starts_at: new Date().toISOString(),
            },
          });
          setCall(newCall);
        }

        setIsCallLoading(false);
      } catch (error) {
        console.error("Error loading call:", error);
        setIsCallLoading(false);
      }
    };

    loadCall();
  }, [client, id]);

  return { call, isCallLoading };
};
