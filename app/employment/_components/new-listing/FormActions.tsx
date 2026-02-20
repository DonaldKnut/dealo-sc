"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ButtonLoader } from "@/components/ui/Loader";
import { useRouter } from "next/navigation";
import { formTheme, formContent } from "./formTheme";

interface FormActionsProps {
  isLoading: boolean;
  isFormComplete: boolean;
  onCancel?: () => void;
  theme?: typeof formTheme;
  content?: typeof formContent;
}

export default function FormActions({
  isLoading,
  isFormComplete,
  onCancel,
  theme = formTheme,
  content = formContent,
}: FormActionsProps) {
  const router = useRouter();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-between items-center pt-12 border-t border-white/[0.05]">
      <motion.button
        whileHover={{ x: -5 }}
        type="button"
        onClick={handleCancel}
        className={theme.buttons.secondary}
      >
        <span className="opacity-50 mr-2">←</span> {content.buttons.cancel}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isLoading || !isFormComplete}
        className={`px-12 py-5 flex items-center justify-center gap-4 transition-all duration-500 transform ${theme.buttons.primary
          } ${!isFormComplete || isLoading
            ? "opacity-50 cursor-not-allowed transform-none grayscale"
            : ""
          }`}
      >
        {isLoading ? (
          <ButtonLoader text={content.buttons.submitting} />
        ) : (
          <>
            <span className="font-black uppercase tracking-[0.3em] text-[10px]">
              {content.buttons.submit}
            </span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </motion.button>
    </div>
  );
}
