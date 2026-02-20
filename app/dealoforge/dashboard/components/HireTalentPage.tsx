"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Handshake, Users, Mail } from "lucide-react";

const HireTalentPage = () => {
  const [mode, setMode] = useState<"request" | "direct">("request");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Hire Talent</h1>
        <p className="text-gray-400">
          Choose to request proposals or send a direct hire offer
        </p>
      </div>

      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
        <div className="flex gap-3">
          <button
            onClick={() => setMode("request")}
            className={`px-4 py-2 rounded-lg text-sm ${
              mode === "request"
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            <Users className="inline w-4 h-4 mr-1" /> Request Proposals
          </button>
          <button
            onClick={() => setMode("direct")}
            className={`px-4 py-2 rounded-lg text-sm ${
              mode === "direct"
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            <Handshake className="inline w-4 h-4 mr-1" /> Direct Hire
          </button>
        </div>

        {mode === "request" ? (
          <div className="mt-6 space-y-4">
            <input
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              placeholder="Project title"
            />
            <textarea
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white min-h-[140px]"
              placeholder="Describe your project and expectations"
            />
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Publish Request
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <input
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              placeholder="Freelancer handle or email"
            />
            <textarea
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white min-h-[140px]"
              placeholder="Brief message and offer details"
            />
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Send Offer <Mail className="inline w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HireTalentPage;
