import React from "react";

import ForgeFeatured from "./_components/ForgeFeatured";
import DealoForge from "./_components/DealoForge";
import ForgeComponent from "@/components/ForgeComponent";
import HeaderX from "./_components/HeaderX";

// Static page - no need for force-dynamic

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <HeaderX />
      <ForgeFeatured />
      <DealoForge />
      <ForgeComponent />
    </div>
  );
};

export default page;
