"use client";
import { createContext, ReactNode, useContext, useState } from "react";

// Define the shape of your user input (can be extended with more fields)
interface UserInput {
  category?: string; // Add other fields as needed
}

// Define the context type, with setUserInput accepting a function or direct value
interface UserInputContextType {
  userInput: UserInput;
  setUserInput: (input: UserInput | ((prev: UserInput) => UserInput)) => void;
}

// Create the context with an initial value or undefined
export const UserInputContext = createContext<UserInputContextType | undefined>(
  undefined
);

// Create a custom hook to use the context easily
export const useUserInput = () => {
  const context = useContext(UserInputContext);
  if (!context) {
    throw new Error("useUserInput must be used within a UserInputProvider");
  }
  return context;
};

// Create a provider component
export const UserInputProvider = ({ children }: { children: ReactNode }) => {
  const [userInput, setUserInput] = useState<UserInput>({});

  return (
    <UserInputContext.Provider value={{ userInput, setUserInput }}>
      {children}
    </UserInputContext.Provider>
  );
};
