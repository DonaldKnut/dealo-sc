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
        <style dangerouslySetInnerHTML={{
          __html: `
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
          <label className="block text-sm font-medium text-gray-300 mb-2.5 font-ui tracking-wide">
            {label}
          </label>
          <div className="relative">
            {/* Animated Glow Effect on Focus */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/30 via-emerald-500/30 to-green-400/30 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-all duration-500"></div>

            <div
              className={`relative border border-white/10 bg-[#0a0f1a]/40 backdrop-blur-xl rounded-2xl transition-all duration-300 group-hover:border-white/20 ${hasError
                  ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                  : "group-focus-within:border-green-500/50 group-focus-within:shadow-[0_0_20px_rgba(34,197,94,0.15)] group-focus-within:bg-black/40"
                }`}
            >
              <div className="flex items-center px-4 py-4.5">
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-all duration-300 ${hasError
                        ? "text-red-400"
                        : "text-green-400/60 group-focus-within:text-green-400 group-focus-within:scale-110"
                      }`}
                  />
                  {!hasError && (
                    <div className="absolute inset-0 bg-green-400/20 blur-md rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  )}
                </div>

                <input
                  ref={ref}
                  className={`flex-1 ml-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm font-body font-normal ${showPasswordToggle ? "pr-10" : ""
                    } ${className}`}
                  {...props}
                />

                {showPasswordToggle && onTogglePassword && (
                  <button
                    type="button"
                    onClick={onTogglePassword}
                    className="absolute right-4 text-gray-500 hover:text-green-400 transition-all duration-200 p-1.5 rounded-xl hover:bg-white/10"
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
              className={`mt-2.5 ${errorMessages.length > 1 ? 'space-y-2' : 'flex items-center gap-2'} text-xs font-body font-medium text-red-400`}
            >
              {errorMessages.map((msg, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-red-500/5 border border-red-500/10 px-2 py-1.5 rounded-lg w-fit">
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

