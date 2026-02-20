"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import Cookies from "js-cookie";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = Cookies.get("cookie-consent");
    if (!cookieConsent) {
      // Show popup after 2 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set("cookie-consent", "accepted", { expires: 365 }); // 1 year
    setIsVisible(false);
  };

  const handleDecline = () => {
    Cookies.set("cookie-consent", "declined", { expires: 365 }); // 1 year
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-72 h-72 bg-green-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-start gap-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white mb-2">
                    We value your privacy
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    We use cookies to enhance your browsing experience, serve
                    personalized content, and analyze our traffic. By clicking
                    &quot;Accept All&quot;, you consent to our use of cookies.
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAccept}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      Accept All Cookies
                    </button>
                    <button
                      onClick={handleDecline}
                      className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-600 transition-all duration-200"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;
