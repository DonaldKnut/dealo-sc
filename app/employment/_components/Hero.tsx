"use client";
import { IoSearchCircle } from "react-icons/io5";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  const images = [
    "/jobs.png",
    "/mpg-why-you-need-to-respond-to-all-job-applicants-removebg-preview.png",
    "https://res.cloudinary.com/dyaetoldv/image/upload/v1740367813/ztjpqlejz326jauwjkfa.png",
    "https://res.cloudinary.com/dyaetoldv/image/upload/v1740367813/ycn5adnneochcnxqxvgy.png",
    "https://res.cloudinary.com/dyaetoldv/image/upload/v1740367809/akoikfh4dkz94lqy5ake.png",
    "https://res.cloudinary.com/dyaetoldv/image/upload/v1740367808/ahm9tqxyiickzqlwzv49.png",
    "https://res.cloudinary.com/dyaetoldv/image/upload/v1740367806/rptvknqf3nrqolncwl9d.png",
    "https://res.cloudinary.com/dyaetoldv/image/upload/v1740367806/ueypnqadggkp3cz3llfu.png",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    
    if (trimmedQuery) {
      // Redirect to search page with query
      router.push(`/jobs/search?q=${encodeURIComponent(trimmedQuery)}`);
    } else {
      // If no query, just go to browse all jobs
      router.push(`/jobs/search`);
    }
  };

  const [stats, setStats] = useState([
    { value: "10K+", label: "Active Jobs" },
    { value: "500+", label: "Companies" },
    { value: "50K+", label: "Job Seekers" },
    { value: "95%", label: "Success Rate" },
  ]);

  // Fetch real-time statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/employment/stats");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.stats) {
            setStats([
              { value: data.stats.activeJobs || "10K+", label: "Active Jobs" },
              { value: data.stats.totalCompanies || "500+", label: "Companies" },
              { value: data.stats.totalJobSeekers || "50K+", label: "Job Seekers" },
              { value: data.stats.successRate || "95%", label: "Success Rate" },
            ]);
          }
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
        // Keep default stats on error
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-[#0f1a0f] to-black">
      {/* Subtle dot pattern background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-purple-500/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <Plus className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">
                Take Full Control of Your Career
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Empowering Talent,
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                One Opportunity at a Time
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
              Dealo was created to meet the need for a fast, intuitive, and flexible job platform that helps job seekers and employers achieve maximum productivity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => router.push("/employment/new-listing")}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40"
              >
                Post a Job
              </button>
              <button
                onClick={() => router.push("/jobs/search")}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                Browse Jobs
              </button>
            </div>

            {/* Statistics Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Image Slider */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative h-[500px] lg:h-[600px] flex items-center justify-center"
          >
            {/* Slider Container with Modern Frame */}
            <div className="relative w-full max-w-md h-full rounded-3xl overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm p-4">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/20">
                {images.map((src, index) => {
                  const isActive = index === currentImageIndex;
                  const isPrev = index === (currentImageIndex - 1 + images.length) % images.length;
                  
                  return (
                    <motion.div
                      key={src}
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        scale: isActive ? 1 : 0.9,
                        x: isActive ? 0 : isPrev ? -50 : 50,
                      }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Image
                        src={src}
                        alt={`Career opportunity ${index + 1}`}
                        width={400}
                        height={400}
                        className="object-contain w-full h-full"
                      />
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Slider Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "w-8 bg-purple-500"
                        : "w-2 bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search Bar - Below Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <form onSubmit={handleSearch} className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-32 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              placeholder="Search for jobs, companies, or skills..."
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 font-medium shadow-lg shadow-purple-500/25"
            >
              Search <IoSearchCircle className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
