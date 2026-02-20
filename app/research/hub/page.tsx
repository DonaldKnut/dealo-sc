import React from "react"

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
;

type Props = {};

const page = (props: Props) => {
  return <div>page</div>;
};

export default page;
