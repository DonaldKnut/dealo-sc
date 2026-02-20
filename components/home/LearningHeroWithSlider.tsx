"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Globe,
  Zap,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const slides = [
  {
    id: "certification",
    icon: Shield,
    label: "Global Credibility",
    title: "AI-Certified Credentials",
    description: "Our certifications are backed by advanced verification, ensuring trust from top global employers.",
    accent: "emerald",
    bg: "from-emerald-600/20 via-emerald-900/40 to-black",
    visual: (
      <div className="relative w-full h-full min-h-[280px] rounded-2xl overflow-hidden">
        <Image
          src="/assets/💪 Ready to level up your life game_ Our Youth….jpg"
          alt="Level up your life — global visibility"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 550px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>
    )
  },
  {
    id: "freelance",
    icon: Zap,
    label: "Marketplace Evolution",
    title: "Scale Your Talent",
    description: "Access the world's most dynamic freelance ecosystem. Connect, collaborate, and conquer projects.",
    accent: "green",
    bg: "from-green-600/20 via-green-900/40 to-black",
    visual: (
      <div className="relative w-full h-full min-h-[280px] rounded-2xl overflow-hidden">
        <Image
          src="/assets/Learning a digital skill will save you time and money_ Teens should learn skills on the internet instead of endless scrolling_.jpg"
          alt="Learning digital skills — scale your talent"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 550px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>
    )
  },
  {
    id: "learning",
    icon: Globe,
    label: "Infinite Learning",
    title: "Skills for the Future",
    description: "Learn from industry giants. 1,000+ courses across AI, Blockchain, and Modern Engineering.",
    accent: "teal",
    bg: "from-teal-600/20 via-teal-900/40 to-black",
    visual: (
      <div className="relative w-full h-full min-h-[280px] rounded-2xl overflow-hidden">
        <Image
          src="/assets/Young multiethnic students using computer inside university classroom _ Premium Photo.jpg"
          alt="Young multiethnic students in university classroom — infinite learning"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 550px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>
    )
  }
];

export default function LearningHeroWithSlider() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-black via-[#0f1a0f] to-black overflow-hidden">
      {/* Dynamic Background Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[currentSlide].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].bg} opacity-60`}
        />
      </AnimatePresence>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Premium Message */}
          <div className="space-y-10 text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-xs font-black uppercase tracking-[0.2em]"
            >
              <Sparkles className="w-4 h-4 fill-emerald-300" />
              Empowering 50,000+ Professionals
            </motion.div>

            <motion.div
              key={slides[currentSlide].title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h1 className="text-6xl sm:text-7xl xl:text-[6.5rem] font-black text-white leading-none tracking-tighter">
                {slides[currentSlide].title.split(" ")[0]} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600">
                  {slides[currentSlide].title.split(" ").slice(1).join(" ")}
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-400 max-w-xl leading-relaxed font-medium">
                {slides[currentSlide].description}
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/courses")}
                className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-black text-lg uppercase tracking-wider flex items-center gap-3 shadow-[0_0_30px_rgba(52,211,153,0.3)] hover:shadow-emerald-500/50 transition-all"
              >
                Join Now Free
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <div className="flex items-center gap-4 py-4 px-2">
                <div className="flex -space-x-3">
                  {[
                    { src: "/assets/Samuel David Potter.jpg", alt: "Expert" },
                    { src: "/assets/Portrait 🤍 __ Cooperate headshot.jpg", alt: "Expert" },
                  ].map((avatar, id) => (
                    <div key={id} className="relative w-10 h-10 rounded-full border-2 border-[#020617] overflow-hidden flex-shrink-0 bg-gray-800">
                      <Image src={avatar.src} alt={avatar.alt} fill className="object-cover" sizes="40px" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="text-white font-bold block">4.9/5 Rating</span>
                  <span className="text-gray-500 uppercase text-[10px] font-black tracking-widest leading-none">Global Experts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: World-Class Interactive Slider */}
          <div className="relative group">
            <div className="absolute -inset-10 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotateY: -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-square w-full max-w-[550px] mx-auto rounded-[3rem] bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-1 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
                <div className="w-full h-full flex flex-col justify-end p-12">
                  <div className="flex-1 flex items-center justify-center p-8">
                    {slides[currentSlide].visual}
                  </div>

                  <div className="space-y-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      Featured Vertical
                    </span>
                    <h2 className="text-3xl font-black text-white">{slides[currentSlide].label}</h2>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6">
              <button
                onClick={prevSlide}
                className="w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-emerald-500 transition-all hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-10 bg-emerald-500' : 'w-2 bg-white/20'}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-emerald-500 transition-all hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Side Accents */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-96 bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute right-0 top-1/4 w-32 h-64 bg-green-500/5 blur-[100px] pointer-events-none" />
    </section>
  );
}
