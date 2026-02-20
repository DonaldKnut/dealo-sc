"use client";
import ReactTimeAgo from "react-timeago";

export default function TimeAgo({ createdAt }: { createdAt: Date }) {
  return (
    <>
      <ReactTimeAgo date={createdAt} />
    </>
  );
}
