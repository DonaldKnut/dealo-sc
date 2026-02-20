import React from "react";
import { DollarSign, BarChart, Target, Shield } from "lucide-react";

const FeaturedPlans = () => {
  return (
    <section className="py-10 px-4 md:px-10 lg:px-20">
      <div className="flex justify-between items-center mb-6 mt-6">
        <h3 className="text-4xl font-semibold text-green-700 playfair-italic">
          Featured Plans
        </h3>
        <a href="#" className="text-sm text-green-300 hover:underline">
          Explore All
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-green-800 p-6 rounded-lg shadow-md border border-green-500 transform hover:scale-105 transition-transform duration-300 hover:shadow-lg">
          <DollarSign className="text-green-300 w-8 h-8 mb-4" />
          <p className="text-sm font-bold text-green-300">Skill-Building</p>
          <h4 className="text-xl font-semibold mb-4 text-white">
            AI-Powered Learning
          </h4>
          <p className="text-sm mb-4 text-green-200">
            Personalized, AI-driven courses to fast-track your career.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-green-700 p-6 rounded-lg shadow-md border border-green-500 transform hover:scale-105 transition-transform duration-300 hover:shadow-lg">
          <BarChart className="text-green-300 w-8 h-8 mb-4" />
          <p className="text-sm font-bold text-green-300">Freelancing</p>
          <h4 className="text-xl font-semibold mb-4 text-white">
            Seamless Gig Integration
          </h4>
          <p className="text-sm mb-4 text-green-200">
            Transition smoothly from learning skills to finding paid gigs.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-green-600 p-6 rounded-lg shadow-md border border-green-500 transform hover:scale-105 transition-transform duration-300 hover:shadow-lg">
          <Target className="text-green-300 w-8 h-8 mb-4" />
          <p className="text-sm font-bold text-green-300">Career Tools</p>
          <h4 className="text-xl font-semibold mb-4 text-white">
            AI Mock Interviews
          </h4>
          <p className="text-sm mb-4 text-green-200">
            Practice interviews tied to skill development and freelancing.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-green-500 p-6 rounded-lg shadow-md border border-green-400 transform hover:scale-105 transition-transform duration-300 hover:shadow-lg">
          <Shield className="text-green-300 w-8 h-8 mb-4" />
          <p className="text-sm font-bold text-green-300">Financial Support</p>
          <h4 className="text-xl font-semibold mb-4 text-white">
            Skill-Based Loans
          </h4>
          <p className="text-sm mb-4 text-green-200">
            Access loans tied directly to global job market demand.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPlans;
