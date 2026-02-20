import { ReactNode } from "react";

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="relative">
      <div className="flex">
        <div className="w-full">{children}</div>
      </div>
    </main>
  );
};

export default RootLayout;
