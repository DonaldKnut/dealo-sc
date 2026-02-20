"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useDrag, usePinch } from "@use-gesture/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ClipLoader } from "react-spinners";

const Modal: React.FC<{
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
}> = ({ images, currentIndex, onClose, onNavigate }) => {
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [closing, setClosing] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") onNavigate("prev");
      if (event.key === "ArrowRight") onNavigate("next");
      if (event.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onNavigate, handleClose]);

  useDrag(
    ({ movement: [x], direction: [xDir], velocity: [vx], last }) => {
      const threshold = 0.2;
      const isFlick = vx > threshold;
      const horizontalDirection = xDir > 0 ? 1 : -1;

      if (last) {
        if (horizontalDirection < 0 && (isFlick || x < -75)) {
          onNavigate("next");
        } else if (horizontalDirection > 0 && (isFlick || x > 75)) {
          onNavigate("prev");
        }
        setOffset(0);
      } else {
        setOffset(x * 0.5);
      }
    },
    { axis: "x", target: modalRef }
  );

  usePinch(
    ({ movement: [s], last }) => {
      const newScale = Math.max(1, Math.min(3, scale * s));
      setScale(newScale);
      if (last && newScale <= 1.1) setScale(1);
    },
    { target: modalRef }
  );

  const lastTap = useRef<number>(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setScale(1);
    }
    lastTap.current = now;
  };

  const isMobile = windowSize.width < 768;
  const modalSize = isMobile
    ? { width: "100vw", height: "100vh" }
    : { width: "80vw", height: "80vh" };

  return (
    <AnimatePresence>
      {!closing && (
        <motion.div
          ref={modalRef}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center"
            style={{ width: modalSize.width, height: modalSize.height }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.7 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-5 right-5 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 z-50"
              onClick={handleClose}
            >
              <X className="text-gray-800 w-6 h-6" />
            </button>

            <div
              className="relative flex items-center justify-center w-full h-full overflow-hidden transition-transform duration-300 ease-out"
              style={{ transform: `translateX(${offset}px) scale(${scale})` }}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
                  <ClipLoader color="#ffffff" size={50} />
                </div>
              )}
              <div onClick={handleDoubleTap} className="relative w-full h-full">
                <Image
                  src={images[currentIndex]}
                  alt={`Image ${currentIndex + 1}`}
                  fill
                  objectFit="contain"
                  className="select-none"
                  onLoadingComplete={() => setIsLoading(false)}
                />
              </div>
            </div>

            {currentIndex > 0 && (
              <button
                className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:bg-gray-200 z-50"
                onClick={() => onNavigate("prev")}
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
            )}
            {currentIndex < images.length - 1 && (
              <button
                className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:bg-gray-200 z-50"
                onClick={() => onNavigate("next")}
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
