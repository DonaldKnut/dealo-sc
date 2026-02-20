import React from "react";
import { motion } from "framer-motion";

const SecureBankingUI: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Main Section */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-7xl py-16 px-4"
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Text Content */}
          <div className="text-center md:text-left md:w-1/2">
            <h1 className="text-5xl font-extrabold text-white leading-tight">
              Secure your money with precision.
            </h1>
            <p className="text-white mt-4 text-lg">
              Join over a million people who choose Synflow for fast and secure
              future banking.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-700 text-white py-3 px-6 mt-6 rounded-full shadow-lg hover:bg-green-800"
            >
              Open Account
            </motion.button>
          </div>
          {/* Image */}
          <div className="md:w-1/2">
            <motion.img
              src="/dealo_hero.png"
              alt="Secure Money"
              className="w-full h-auto rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="flex justify-center gap-12 mt-12 text-green-700 font-medium">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <p className="text-3xl font-bold text-green-900">140+</p>
            <p>Total Currencies</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <p className="text-3xl font-bold text-green-900">$1.2B</p>
            <p>Revenue Generated</p>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-green-100 p-6 rounded-lg shadow-md text-left"
          >
            <h3 className="text-xl font-bold text-green-900">Extra Secure</h3>
            <p className="mt-2 text-green-700">
              Fraud and security keep your money safe
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-green-100 p-6 rounded-lg shadow-md text-left"
          >
            <h3 className="text-xl font-bold text-green-900">Currencies</h3>
            <p className="mt-2 text-green-700">
              Hundreds of countries in one card
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-green-100 p-6 rounded-lg shadow-md text-left"
          >
            <h3 className="text-xl font-bold text-green-900">Growth Revenue</h3>
            <p className="mt-2 text-green-700">
              $50,240 USD <span className="text-green-500">(+0.024%)</span>
            </p>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default SecureBankingUI;
