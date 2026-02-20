"use client";

// Force dynamic rendering for authentication
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useSafeSession } from "@/hooks/use-safe-session";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";

import { useGetCallById } from "../../../app/video-chat/(hooks)/useGetCallById";
import Alert from "../../../app/video-chat/_components/Alert";
import MeetingSetup from "../../../app/video-chat/_components/MeetingSetup";
import MeetingRoom from "../../../app/video-chat/_components/MeetingRoom";

interface CallMember {
  user: {
    id: string;
  };
}

const MeetingPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const session = useSafeSession();
  const { data: sessionData, status } = session || {};
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const isSessionLoading = status === "loading";
  const user = sessionData?.user;

  if (isSessionLoading || isCallLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading meeting...</p>
        </div>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Call Not Found
          </h1>
          <p className="text-gray-300 mb-6">
            The meeting you&apos;re looking for doesn&apos;t exist or has ended.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Ensure the 'm' parameter has an explicit type
  const notAllowed =
    call.type === "invited" &&
    (!user ||
      !call.state.members.find((m: CallMember) => m.user.id === user._id));

  if (notAllowed)
    return <Alert title="You are not allowed to join this meeting" />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;
