"use client";

import { ReactNode } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { formTheme } from "./formTheme";

interface FormWrapperProps {
  children: ReactNode;
  methods: UseFormReturn<any>;
  theme?: typeof formTheme;
}

export default function FormWrapper({
  children,
  methods,
  theme = formTheme,
}: FormWrapperProps) {
  return (
    <FormProvider {...methods}>
      <div className="relative group">
        {/* Glow Effect */}
        <div
          className="absolute -inset-4 bg-emerald-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[4rem] pointer-events-none"
        />

        {/* Main form container */}
        <div
          className={`relative ${theme.formContainer.background} ${theme.formContainer.backdropBlur} ${theme.formContainer.borderRadius} ${theme.formContainer.shadow} ${theme.formContainer.border} ${theme.formContainer.padding} ${theme.formContainer.spacing} overflow-hidden`}
        >
          {/* Internal Accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.03] blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/[0.03] blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

