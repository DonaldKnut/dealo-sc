"use client";
import { useState } from "react";
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, LayoutList } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Loader from "./Loader";
import EndCallButton from "./EndCallButton";
import { cn } from "@/lib/utils";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  // for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-2 sm:pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center px-2 sm:px-4">
          <CallLayout />
        </div>
        <div
          className={cn("h-[calc(100vh-86px)] hidden sm:block ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      {/* Mobile Participants Panel */}
      {showParticipants && (
        <div className="sm:hidden fixed inset-0 bg-black/80 z-50">
          <div className="h-full w-full bg-[#19232d] p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Participants</h3>
              <button
                onClick={() => setShowParticipants(false)}
                className="text-white hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <CallParticipantsList onClose={() => setShowParticipants(false)} />
          </div>
        </div>
      )}

      {/* video layout and call controls */}
      <div className="fixed bottom-0 left-0 right-0 flex w-full items-center justify-center gap-2 sm:gap-5 p-2 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-2 sm:gap-4">
          <CallControls onLeave={() => router.push(`/`)} />

          <DropdownMenu>
            <div className="flex items-center">
              <DropdownMenuTrigger className="cursor-pointer rounded-xl sm:rounded-2xl bg-[#19232d] px-2 sm:px-4 py-2 hover:bg-[#4c535b]">
                <LayoutList size={16} className="text-white sm:w-5 sm:h-5" />
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
              {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
                <div key={index}>
                  <DropdownMenuItem
                    onClick={() =>
                      setLayout(item.toLowerCase() as CallLayoutType)
                    }
                  >
                    {item}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="border-dark-1" />
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <CallStatsButton />

          <button onClick={() => setShowParticipants((prev) => !prev)}>
            <div className="cursor-pointer rounded-xl sm:rounded-2xl bg-[#19232d] px-2 sm:px-4 py-2 hover:bg-[#4c535b]">
              <Users size={16} className="text-white sm:w-5 sm:h-5" />
            </div>
          </button>

          {!isPersonalRoom && <EndCallButton />}
        </div>
      </div>
    </section>
  );
};

export default MeetingRoom;
