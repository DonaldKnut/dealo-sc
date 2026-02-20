"use client";

import { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { formTheme } from "./formTheme";

interface BudgetInputProps {
  name: string;
  label: string;
  control: Control<any>;
  errorMessage?: string;
  theme?: typeof formTheme;
}

// Exchange rate (you can fetch this from an API in production)
const EXCHANGE_RATE = 1500; // 1 USD = 1500 NGN (approximate)

export default function BudgetInput({
  name,
  label,
  control,
  errorMessage,
  theme = formTheme,
}: BudgetInputProps) {
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");
  const [displayValue, setDisplayValue] = useState<string>("");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">
          {label}
        </label>
        <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/[0.05] rounded-xl backdrop-blur-3xl">
          <button
            type="button"
            onClick={() => {
              setCurrency("NGN");
              setDisplayValue("");
            }}
            className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${currency === "NGN"
                ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                : "text-white/20 hover:text-white/40"
              }`}
          >
            ₦ NGN
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrency("USD");
              setDisplayValue("");
            }}
            className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${currency === "USD"
                ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                : "text-white/20 hover:text-white/40"
              }`}
          >
            $ USD
          </button>
        </div>
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const storedValue = field.value || 0;
          const convertedDisplayValue = currency === "NGN"
            ? storedValue * EXCHANGE_RATE
            : storedValue;

          const handleChange = (value: string) => {
            const numValue = parseFloat(value) || 0;
            setDisplayValue(value);
            const usdValue = currency === "NGN"
              ? numValue / EXCHANGE_RATE
              : numValue;
            field.onChange(usdValue);
          };

          const currentDisplay = displayValue || (convertedDisplayValue > 0 ? convertedDisplayValue.toString() : "");
          const oppositeValue = currentDisplay
            ? (currency === "NGN"
              ? parseFloat(currentDisplay) / EXCHANGE_RATE
              : parseFloat(currentDisplay) * EXCHANGE_RATE)
            : 0;

          return (
            <div className="space-y-3">
              <div className="relative group/input">
                <span className={`absolute left-6 top-1/2 -translate-y-1/2 text-xl font-black ${currency === "NGN" ? "text-emerald-500/40" : "text-emerald-500/40"}`}>
                  {currency === "NGN" ? "₦" : "$"}
                </span>
                <input
                  type="number"
                  value={currentDisplay}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={field.onBlur}
                  placeholder={currency === "NGN" ? "MIN 500,000" : "MIN 500"}
                  className={`w-full pl-12 pr-6 py-5 ${theme.input.background} ${theme.input.border} ${theme.input.borderRadius} ${theme.input.text} ${theme.input.placeholder} ${theme.input.backdropBlur} ${theme.input.hover} ${theme.input.borderFocus} ${theme.input.ringFocus} transition-all outline-none text-2xl font-black tracking-tight`}
                  min="0"
                  step="0.01"
                />
              </div>
              {oppositeValue > 0 && currentDisplay && (
                <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em] ml-2">
                  Market Valuation: {currency === "NGN" ? "$" : "₦"}{" "}
                  {oppositeValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {currency === "NGN" ? "USD" : "NGN"}
                </p>
              )}
            </div>
          );
        }}
      />
      {errorMessage && (
        <p className="text-[10px] font-black text-red-500/70 uppercase tracking-widest ml-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

