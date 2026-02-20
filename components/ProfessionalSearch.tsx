"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Users,
  Briefcase,
  Code,
  Palette,
  Megaphone,
  BarChart3,
  Cpu,
  Shield,
  BookOpen,
  Video,
  Music,
  Camera,
  Globe,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  Zap,
  Target,
  Lightbulb,
} from "lucide-react";

const ProfessionalSearch = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");

  const categories = [
    {
      name: "Programming",
      icon: <Code className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
    },
    {
      name: "Design",
      icon: <Palette className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
    },
    {
      name: "Marketing",
      icon: <Megaphone className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
    },
    {
      name: "Business",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-500/20 to-red-500/20",
      borderColor: "border-orange-500/30",
    },
    {
      name: "AI & Data",
      icon: <Cpu className="w-6 h-6" />,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-gradient-to-br from-indigo-500/20 to-purple-500/20",
      borderColor: "border-indigo-500/30",
    },
    {
      name: "Cybersecurity",
      icon: <Shield className="w-6 h-6" />,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-red-500/20 to-pink-500/20",
      borderColor: "border-red-500/30",
    },
    {
      name: "Education",
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-teal-500/20 to-cyan-500/20",
      borderColor: "border-teal-500/30",
    },
    {
      name: "Video & Media",
      icon: <Video className="w-6 h-6" />,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-gradient-to-br from-pink-500/20 to-rose-500/20",
      borderColor: "border-pink-500/30",
    },
    {
      name: "Music & Audio",
      icon: <Music className="w-6 h-6" />,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500/30",
    },
    {
      name: "Photography",
      icon: <Camera className="w-6 h-6" />,
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-gradient-to-br from-cyan-500/20 to-blue-500/20",
      borderColor: "border-cyan-500/30",
    },
  ];

  const locations = [
    "Remote",
    "Lagos",
    "Abuja",
    "Port Harcourt",
    "Kano",
    "Ibadan",
    "Kaduna",
    "Enugu",
    "Calabar",
    "Uyo",
  ];

  const experienceLevels = [
    "Entry Level",
    "Mid Level",
    "Senior Level",
    "Expert Level",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? "" : category);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5"></div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 via-transparent to-transparent"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-green-300 font-semibold text-lg">
              Professional Search
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
            Find Your Perfect{" "}
            <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Professional
            </span>
          </h2>
          <p className="text-body-large text-gray-300 max-w-3xl mx-auto font-body">
            Connect with certified professionals across all industries. From
            traditional artisans to cutting-edge tech experts, find the perfect
            match for your project.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.form
          onSubmit={handleSearch}
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for professionals, skills, or services..."
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-green-500/30 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 font-body"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Zap className="w-5 h-5" />
                  Search
                </motion.button>
              </div>
            </div>
          </div>
        </motion.form>

        {/* Categories */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              Browse by Category
            </h3>
            <p className="text-gray-400">
              Find professionals in your area of interest
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`relative group p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedCategory === category.name
                    ? `${category.bgColor} ${category.borderColor} border-opacity-100`
                    : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                }`}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-center space-y-3">
                  <div
                    className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center bg-gradient-to-r ${category.color}`}
                  >
                    {category.icon}
                  </div>
                  <h4 className="font-semibold text-white text-sm">
                    {category.name}
                  </h4>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              Refine Your Search
            </h3>
            <p className="text-gray-400">
              Filter by location and experience level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Location Filter */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-white">
                Location
              </label>
              <div className="grid grid-cols-2 gap-2">
                {locations.map((location, index) => (
                  <motion.button
                    key={location}
                    onClick={() =>
                      setSelectedLocation(
                        selectedLocation === location ? "" : location
                      )
                    }
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedLocation === location
                        ? "bg-green-500 text-white shadow-lg"
                        : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {location}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Experience Filter */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-white">
                Experience Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {experienceLevels.map((level, index) => (
                  <motion.button
                    key={level}
                    onClick={() =>
                      setSelectedExperience(
                        selectedExperience === level ? "" : level
                      )
                    }
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedExperience === level
                        ? "bg-green-500 text-white shadow-lg"
                        : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      {level}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-400">50K+</div>
              <div className="text-gray-400 text-sm">Active Professionals</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-400">95%</div>
              <div className="text-gray-400 text-sm">Success Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-400">₦2B+</div>
              <div className="text-gray-400 text-sm">Total Earnings</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-400">24/7</div>
              <div className="text-gray-400 text-sm">Support Available</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProfessionalSearch;
