import { motion } from "framer-motion";
import Link from "next/link";
import { FaUser, FaRocket, FaInfinity, FaCheck } from "react-icons/fa";

const pricingPlans = [
  {
    title: "Free Plan",
    price: "$0 USD",
    description: "Basic access to features.",
    features: [
      "Basic course generation",
      "Access to templates",
      "Community support",
    ],
    highlight: false,
    icon: <FaUser size={24} />,
  },
  {
    title: "Expert Plan", // Renamed and styled as the recommended plan
    price: "$25 USD",
    description: "Ideal for power users and teams.",
    features: [
      "Priority access to new features",
      "Advanced analytics",
      "Increased API limits",
    ],
    highlight: true, // Marked as the recommended plan
    icon: <FaRocket size={24} />,
  },
  {
    title: "Scale Plan",
    price: "$75 USD",
    description: "For enterprises and large-scale needs.",
    features: [
      "Dedicated support",
      "Custom branding",
      "Team collaboration tools",
    ],
    highlight: false,
    icon: <FaInfinity size={24} />,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen text-white p-6">
      <main className="text-center my-16">
        <motion.h2
          className="text-4xl font-extrabold"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Find the Right Plan for You
        </motion.h2>
        <p className="text-lg text-green-300 mt-4">
          Choose the plan that meets your needs with dynamic course creation
          tools.
        </p>

        <div className="flex justify-center gap-6 mt-12 flex-wrap">
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.title}
              className={`w-full max-w-sm p-6 rounded-3xl shadow-lg flex flex-col justify-between ${
                plan.highlight
                  ? "bg-green-600 text-white scale-105 border-4 border-green-400 shadow-xl"
                  : "bg-green-800"
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: plan.highlight ? 1.1 : 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <div className="flex items-center">
                  <div
                    className={`w-16 h-16 flex items-center justify-center rounded-full ${
                      plan.highlight ? "bg-green-400" : "bg-green-700"
                    }`}
                  >
                    {plan.icon}
                  </div>
                  <div className="ml-4 text-left">
                    <h3
                      className={`text-2xl font-bold ${
                        plan.highlight ? "text-white" : "text-green-300"
                      }`}
                    >
                      {plan.title}
                    </h3>
                    <p className="text-3xl font-bold">{plan.price}</p>
                    <p className="text-green-300 mt-2">{plan.description}</p>
                  </div>
                </div>
              </div>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500">
                      <FaCheck className="text-white" />
                    </div>
                    <span className="text-green-200">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 mt-6 rounded-lg ${
                  plan.highlight
                    ? "bg-white text-green-600 hover:bg-green-300"
                    : "bg-green-600 hover:bg-green-500"
                }`}
                onClick={() => alert(`You selected the ${plan.title}!`)}
              >
                Select Plan
              </button>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="mt-16 text-center">
        <motion.p
          className="text-green-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Upgrade to access advanced features and unlock your potential.
        </motion.p>
      </footer>
    </div>
  );
}
