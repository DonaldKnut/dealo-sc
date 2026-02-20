import { ReactNode, useState } from "react";
import { UserInputProvider } from "../../dealoforge/_context/UserInputContext";

const CreateCourseLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="relative">
      <div className="flex">
        <div className="w-full">
          {/* Wrap content with the UserInputProvider */}
          <UserInputProvider>{children}</UserInputProvider>
        </div>
      </div>
    </main>
  );
};

export default CreateCourseLayout;
