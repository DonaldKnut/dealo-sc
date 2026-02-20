import { UserInputProvider } from "../../context/UserInputContext";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <UserInputProvider>{children}</UserInputProvider>
    </>
  );
};

export default HomeLayout;
