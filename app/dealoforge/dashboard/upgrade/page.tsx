// import CallList from "../video-chat/_components/CallList";
"use client";
import PricingPage from "../../_components/PricingPage"

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
;

const PricingPlanPage = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <PricingPage />
    </section>
  );
};

export default PricingPlanPage;
