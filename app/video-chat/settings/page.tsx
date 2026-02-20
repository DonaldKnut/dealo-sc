"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  Mic,
  Camera,
  Volume2,
  Monitor,
  Bell,
  Shield,
  Check,
  ChevronDown,
} from "lucide-react";

const SettingsPage = () => {
  const router = useRouter();

  const [audioInput, setAudioInput] = useState("Default Microphone");
  const [audioOutput, setAudioOutput] = useState("Default Speaker");
  const [videoInput, setVideoInput] = useState("Default Camera");
  const [noiseSuppression, setNoiseSuppression] = useState(true);
  const [autoMuteOnJoin, setAutoMuteOnJoin] = useState(false);
  const [cameraOffOnJoin, setCameraOffOnJoin] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [mirrorVideo, setMirrorVideo] = useState(true);
  const [hdVideo, setHdVideo] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({
    value,
    onChange,
  }: {
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 ${
        value ? "bg-green-500" : "bg-white/10"
      }`}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );

  const sections = [
    {
      title: "Audio",
      icon: Mic,
      items: [
        {
          label: "Microphone",
          description: "Select your input device",
          type: "select" as const,
          value: audioInput,
          options: [
            "Default Microphone",
            "Built-in Microphone",
            "External Mic",
          ],
          onChange: setAudioInput,
        },
        {
          label: "Speaker",
          description: "Select your output device",
          type: "select" as const,
          value: audioOutput,
          options: ["Default Speaker", "Built-in Speaker", "Headphones"],
          onChange: setAudioOutput,
        },
        {
          label: "Noise Suppression",
          description: "Reduce background noise",
          type: "toggle" as const,
          value: noiseSuppression,
          onChange: setNoiseSuppression,
        },
        {
          label: "Mute on Join",
          description: "Start meetings with mic muted",
          type: "toggle" as const,
          value: autoMuteOnJoin,
          onChange: setAutoMuteOnJoin,
        },
      ],
    },
    {
      title: "Video",
      icon: Camera,
      items: [
        {
          label: "Camera",
          description: "Select your video device",
          type: "select" as const,
          value: videoInput,
          options: ["Default Camera", "Built-in Camera", "External Webcam"],
          onChange: setVideoInput,
        },
        {
          label: "HD Video",
          description: "Use high-definition video quality",
          type: "toggle" as const,
          value: hdVideo,
          onChange: setHdVideo,
        },
        {
          label: "Mirror Video",
          description: "Mirror your video preview",
          type: "toggle" as const,
          value: mirrorVideo,
          onChange: setMirrorVideo,
        },
        {
          label: "Camera Off on Join",
          description: "Start meetings with camera off",
          type: "toggle" as const,
          value: cameraOffOnJoin,
          onChange: setCameraOffOnJoin,
        },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        {
          label: "Meeting Notifications",
          description: "Get notified about upcoming meetings",
          type: "toggle" as const,
          value: notifications,
          onChange: setNotifications,
        },
      ],
    },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push("/video-chat")}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
          <p className="text-sm text-gray-500">
            Configure your audio, video, and meeting preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg transition-all shadow-lg ${
            saved
              ? "bg-green-500 text-white shadow-green-500/20"
              : "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-green-500/20 hover:from-emerald-400 hover:to-green-500"
          }`}
        >
          {saved ? <Check className="w-4 h-4" /> : null}
          {saved ? "Saved" : "Save Changes"}
        </button>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {sections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + si * 0.08 }}
            className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden"
          >
            {/* Section header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/15 to-green-600/15 border border-green-500/10 flex items-center justify-center">
                <section.icon className="w-4 h-4 text-green-400" />
              </div>
              <h2 className="text-sm font-semibold text-white">
                {section.title}
              </h2>
            </div>

            {/* Section items */}
            <div className="divide-y divide-white/[0.04]">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="text-sm text-white font-medium">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  {item.type === "toggle" ? (
                    <Toggle
                      value={item.value as boolean}
                      onChange={item.onChange as (v: boolean) => void}
                    />
                  ) : (
                    <div className="relative">
                      <select
                        value={item.value as string}
                        onChange={(e) =>
                          (item.onChange as (v: string) => void)(e.target.value)
                        }
                        className="appearance-none bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 pr-8 text-xs text-white focus:outline-none focus:ring-1 focus:ring-green-500/40 transition-all cursor-pointer"
                      >
                        {(item as { options: string[] }).options?.map((opt) => (
                          <option
                            key={opt}
                            value={opt}
                            className="bg-[#0f1a0f] text-white"
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Security note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex items-start gap-3 px-4 py-3 bg-green-500/[0.04] border border-green-500/10 rounded-xl"
      >
        <Shield className="w-4 h-4 text-green-500/60 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-gray-500 leading-relaxed">
          All video calls are end-to-end encrypted. Your audio and video
          preferences are stored locally on your device.
        </p>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
