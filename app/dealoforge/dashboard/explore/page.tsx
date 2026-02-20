// import CallList from "../_components/CallList";
"use client";
import DealoComparison from "../../_components/DealoComparison";
import SalesCopilotUI from "../../_components/SalesCopilotUI";
import SecureBankingUI from "../../_components/SecureBankingUI"

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
;

const PreviousPage = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <SecureBankingUI />
      <SalesCopilotUI />
      <DealoComparison />
    </section>
  );
};

export default PreviousPage;
