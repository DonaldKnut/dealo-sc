"use client";

import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { AlertCircle, LucideIcon, Eye, EyeOff } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string | string[];
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePassword?: () => void;
  containerClassName?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    {
      label,
      icon: Icon,
      error,
      showPasswordToggle = false,
      isPasswordVisible = false,
      onTogglePassword,
      containerClassName = "",
      className = "",
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const errorMessages = Array.isArray(error) ? error : error ? [error] : [];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px transparent inset !important;
          -webkit-text-fill-color: white !important;
          background-color: transparent !important;
          background-clip: padding-box !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        input:-webkit-autofill::first-line {
          -webkit-text-fill-color: white !important;
        }
      `}} />
      <div className={`group ${containerClassName}`}>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
          <div
            className={`relative border-2 rounded-2xl transition-all duration-300 ${
              hasError
                ? "border-red-500/50 bg-red-500/5"
                : "border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] group-focus-within:border-green-500/50 group-focus-within:bg-white/10"
            }`}
          >
            <div className="flex items-center px-4 py-4">
              <Icon
                className={`w-5 h-5 transition-colors duration-300 ${
                  hasError
                    ? "text-red-400"
                    : "text-green-400/70 group-focus-within:text-green-400"
                }`}
              />
              <input
                ref={ref}
                className={`flex-1 ml-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm ${
                  showPasswordToggle ? "pr-10" : ""
                } ${className}`}
                {...props}
              />
              {showPasswordToggle && onTogglePassword && (
                <button
                  type="button"
                  onClick={onTogglePassword}
                  className="absolute right-4 text-gray-400 hover:text-green-400 transition-colors duration-200 p-1 rounded-lg hover:bg-white/5"
                  tabIndex={-1}
                >
                  {isPasswordVisible ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-2 ${errorMessages.length > 1 ? 'space-y-1.5' : 'flex items-center gap-1.5'} text-xs text-red-400`}
          >
            {errorMessages.map((msg, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{msg}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;

