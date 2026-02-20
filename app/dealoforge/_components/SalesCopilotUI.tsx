import { ChevronRight } from "lucide-react";
import React from "react";
import Image from "next/image";

const SalesCopilotUI: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Main Content */}
      <main className="w-full max-w-6xl flex flex-col items-center text-center py-16 px-4">
        <h1 className="text-5xl font-extrabold text-white leading-tight">
          Say hello to your intelligent sales copilot.
        </h1>
        <p className="text-white mt-4 text-lg">
          10x your sales productivity and concentrate your efforts on the most
          promising prospects.
        </p>

        {/* Email Input */}
        <div className="relative mb-4 w-full max-w-2xl">
          <input
            type="text"
            placeholder="Add your work email"
            onChange={() => {}}
            className="px-6 py-3 rounded-full w-full bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#3b634b]"
          />
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#262726] hover:bg-[#386f37] text-white hover:text-[#adf9ad] px-4 py-2 rounded-full flex items-center gap-2"
            onClick={() => {}}
          >
            Get Access <ChevronRight size={24} color="white" />
          </button>
        </div>

        {/* Integrations Section */}
        <div className="mt-16">
          <p className="text-white font-medium">Backed by</p>
          <div className="mt-2 text-white font-bold">Y Combinator</div>
          <p className="text-green-600 mt-8 font-medium">
            Our AI integrates across most popular sales platforms
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-6">
            <Image
              src="/logos/hubspot.png"
              alt="HubSpot"
              width={48}
              height={48}
              className="h-12"
            />
            <Image
              src="/logos/salesforce.png"
              alt="Salesforce"
              width={48}
              height={48}
              className="h-12"
            />
            <Image
              src="/logos/apolloio.png"
              alt="Apollo.io"
              width={48}
              height={48}
              className="h-12"
            />
            <Image
              src="/logos/salesloft.png"
              alt="Salesloft"
              width={48}
              height={48}
              className="h-12"
            />
            <Image
              src="/logos/outreach.png"
              alt="Outreach"
              width={48}
              height={48}
              className="h-12"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalesCopilotUI;
