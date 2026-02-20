"use client";

// Force dynamic rendering for authentication
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useSafeSession } from "@/hooks/use-safe-session";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams, useRouter } from "next/navigation";
import { useGetCallById } from "../../(hooks)/useGetCallById";
import Alert from "../../_components/Alert";
import MeetingSetup from "../../_components/MeetingSetup";
import MeetingRoom from "../../_components/MeetingRoom";

interface CallMember {
    user: {
        id: string;
    };
}

const RoomPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const session = useSafeSession();
    const { data: sessionData, status } = session || {};
    const { call, isCallLoading } = useGetCallById(id as string);
    const [isSetupComplete, setIsSetupComplete] = useState(false);

    const isSessionLoading = status === "loading";
    const user = sessionData?.user;

    if (isSessionLoading || isCallLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-black">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-white/60 text-sm font-black uppercase tracking-[0.2em]">Authenticating Room...</p>
                </div>
            </div>
        );
    }

    if (!call) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-black">
                <div className="max-w-md w-full p-8 text-center">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                        <div className="w-10 h-10 border-2 border-emerald-500/50 rounded-full border-t-transparent animate-spin" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
                        Call Not Found
                    </h1>
                    <p className="text-gray-500 mb-10 text-sm font-medium leading-relaxed">
                        The meeting session you're looking for doesn't exist or may have been terminated.
                    </p>
                    <button
                        onClick={() => router.push("/video-chat")}
                        className="w-full bg-emerald-500 text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all duration-300 shadow-2xl shadow-emerald-500/20"
                    >
                        Return to Hub
                    </button>
                </div>
            </div>
        );
    }

    // Permission check
    const notAllowed =
        call.type === "invited" &&
        (!user ||
            !call.state.members.find((m: CallMember) => m.user.id === user._id));

    if (notAllowed)
        return <Alert title="Access Denied: You are not invited to this room session." />;

    return (
        <main className="h-screen w-full bg-black">
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

export default RoomPage;
