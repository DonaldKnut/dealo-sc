"use client";
import { Role } from "@/types/role";
// UserInputContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserInputContextProps {
  role: Role;
  setRole: (role: Role) => void;
  formData: any;
  setFormData: (data: any) => void;
}

const UserInputContext = createContext<UserInputContextProps | undefined>(
  undefined
);

export const UserInputProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [role, setRole] = useState<Role>(Role.FREELANCER); // Ensure role is typed correctly
  const [formData, setFormData] = useState<any>({});

  return (
    <UserInputContext.Provider value={{ role, setRole, formData, setFormData }}>
      {children}
    </UserInputContext.Provider>
  );
};

export const useUserInput = () => {
  const context = useContext(UserInputContext);
  if (!context) {
    throw new Error("useUserInput must be used within a UserInputProvider");
  }
  return context;
};
