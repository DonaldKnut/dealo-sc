"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { AlertCircle, X, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

interface ModalProps {
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for exit animation to finish before removing modal
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="relative bg-[#3c5542] border-none bg-opacity-90 border shadow-xl p-8 rounded-2xl text-white max-w-md w-full mx-4 flex flex-col items-center"
          >
            <Image
              src="/find_no_see.png"
              alt="Access Denied"
              width={140}
              height={140}
              className="mb-6"
            />
            <AlertCircle size={56} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-green-500">
              Sign Up or Log In
            </h2>
            <p className="text-gray-300 mt-3 text-center text-lg">
              You need to be logged in to start a conversation.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                className="flex items-center gap-2 bg-[#313131] text-white px-5 py-3 rounded-lg hover:bg-[#599a68] transition"
                onClick={() => router.push("/sign-in")}
              >
                <LogIn size={18} />
                Log In
              </button>
              <button
                className="flex items-center gap-2 bg-[#313131] text-white px-5 py-3 rounded-lg hover:bg-[#599a68] transition"
                onClick={() => router.push("/sign-in")}
              >
                <UserPlus size={18} />
                Sign Up
              </button>
            </div>

            {/* Close Button with Lucide X Icon */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              onClick={handleClose}
            >
              <X size={24} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
