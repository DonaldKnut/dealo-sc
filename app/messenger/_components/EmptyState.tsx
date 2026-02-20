"use client";
import React from "react";

type Props = {};

const EmptyState = (props: Props) => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-gray-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-center flex items-center">
        <h3 className="font-bold text-green-500">
          Select a chat or start a new conversation
        </h3>
      </div>
    </div>
  );
};

export default EmptyState;
