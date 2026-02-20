"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
;
import {
  PenTool,
  BookOpen,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const writerSignupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  writingExperience: z
    .string()
    .min(10, "Please describe your writing experience"),
  writingCategories: z
    .array(z.string())
    .min(1, "Please select at least one category"),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
});

type WriterSignupFormType = z.infer<typeof writerSignupSchema>;

const WriterSignupPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<WriterSignupFormType>({
    resolver: zodResolver(writerSignupSchema),
  });

  const writingCategories = [
    "Technology & AI",
    "Career Development",
    "Freelancing",
    "Professional Skills",
    "Business & Entrepreneurship",
    "Education & Learning",
    "Personal Development",
    "Industry Insights",
    "Success Stories",
    "Tips & Tutorials",
  ];

  const selectedCategories = watch("writingCategories") || [];

  const handleCategoryToggle = (category: string) => {
    const current = selectedCategories;
    if (current.includes(category)) {
      setValue(
        "writingCategories",
        current.filter((c) => c !== category)
      );
    } else {
      setValue("writingCategories", [...current, category]);
    }
  };

  const onSubmit = async (data: WriterSignupFormType) => {
    setIsLoading(true);
    setNotification(null);

    try {
      const response = await fetch("/api/writers/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Registration failed");
      }

      setNotification({
        message: "Writer application submitted successfully! Redirecting to email verification...",
        type: "success",
      });

      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}&type=writer`);
      }, 1000);
    } catch (error) {
      setNotification({
        message:
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 overflow-x-hidden">
      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <main className="relative z-10 pt-32 pb-32">
        <div className="max-w-4xl mx-auto px-6">
          {/* ── HERO ── */}
          <div className="text-center mb-24 space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative inline-block"
            >
              <div className="absolute -inset-4 bg-emerald-500/20 blur-2xl rounded-full opacity-50 animate-pulse" />
              <div className="relative w-24 h-24 bg-white/[0.03] border border-white/10 backdrop-blur-3xl rounded-3xl flex items-center justify-center shadow-2xl">
                <PenTool className="w-10 h-10 text-emerald-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-6">
                <div className="w-12 h-px bg-emerald-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500">Recruitment Protocol</span>
                <div className="w-12 h-px bg-emerald-500" />
              </div>
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic">
                Intelligence <span className="text-emerald-500">Unit</span>
              </h1>
              <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                Join our elite collective of architects. Share high-performance intelligence, monetize your expertise, and engineer the future of professional growth.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* ── BENEFITS ── */}
            <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
              {[
                { icon: <Sparkles className="w-4 h-4" />, label: "Monetized Intelligence", desc: "Premium revenue sharing architecture.", color: "emerald" },
                { icon: <BookOpen className="w-4 h-4" />, label: "Elite Portfolio", desc: "Showcase blueprints to a global network.", color: "blue" },
                { icon: <User className="w-4 h-4" />, label: "Global Presence", desc: "Scale your authority across continents.", color: "purple" },
                { icon: <ArrowRight className="w-4 h-4" />, label: "Growth Delta", desc: "Accelerate your professional trajectory.", color: "orange" },
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-all duration-500"
                >
                  <div className={`w-10 h-10 bg-${benefit.color}-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <div className={`text-${benefit.color}-500`}>{benefit.icon}</div>
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-wider mb-1">{benefit.label}</h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* ── SIGNUP FORM ── */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute -inset-px bg-emerald-500/10 blur-[80px] rounded-[2.5rem] opacity-30" />
                <div className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {notification && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-5 rounded-2xl flex items-center gap-4 ${notification.type === "success"
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          : "bg-red-500/10 border border-red-500/20 text-red-400"
                          }`}
                      >
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-xs font-black uppercase tracking-widest leading-relaxed">{notification.message}</span>
                      </motion.div>
                    )}

                    <div className="space-y-8">
                      {/* Personal Info Group */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Architect: First Name</label>
                          <input
                            {...register("firstName")}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700"
                            placeholder="Initialize First Name"
                          />
                          {errors.firstName && <p className="text-[10px] text-red-400 font-black uppercase tracking-widest ml-1 mt-1">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Architect: Last Name</label>
                          <input
                            {...register("lastName")}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700"
                            placeholder="Initialize Last Name"
                          />
                          {errors.lastName && <p className="text-[10px] text-red-400 font-black uppercase tracking-widest ml-1 mt-1">{errors.lastName.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Network: Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                          <input
                            {...register("email")}
                            type="email"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700"
                            placeholder="Enter secure email"
                          />
                        </div>
                        {errors.email && <p className="text-[10px] text-red-400 font-black uppercase tracking-widest ml-1 mt-1">{errors.email.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Archive: Access Credential</label>
                        <div className="relative">
                          <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                          <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-16 py-4 text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700"
                            placeholder="Create complex password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-700 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-[10px] text-red-400 font-black uppercase tracking-widest ml-1 mt-1">{errors.password.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Mission: Writing Experience</label>
                        <textarea
                          {...register("writingExperience")}
                          rows={4}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700 resize-none"
                          placeholder="Describe your technical expertise and writing trajectory..."
                        />
                        {errors.writingExperience && <p className="text-[10px] text-red-400 font-black uppercase tracking-widest ml-1 mt-1">{errors.writingExperience.message}</p>}
                      </div>

                      {/* Categories Group */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Directives: Specialist Categories</label>
                        <div className="flex flex-wrap gap-2">
                          {writingCategories.map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => handleCategoryToggle(category)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${selectedCategories.includes(category)
                                ? "bg-emerald-500 border-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                                : "bg-white/[0.02] border-white/5 text-gray-500 hover:border-white/20 hover:text-white"
                                }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                        {errors.writingCategories && <p className="text-[10px] text-red-400 font-black uppercase tracking-widest ml-1 mt-1">{errors.writingCategories.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Portfolio: Evidence (Optional)</label>
                        <input
                          {...register("portfolioUrl")}
                          type="url"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700"
                          placeholder="https://portfolio.tech"
                        />
                        {errors.portfolioUrl && <p className="text-[10px] text-red-400 font-black uppercase tracking-widest ml-1 mt-1">{errors.portfolioUrl.message}</p>}
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="group relative w-full py-5 bg-emerald-500 text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl overflow-hidden hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 disabled:opacity-50"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-black/30 border-t-black"></div>
                            <span>Transmitting Data...</span>
                          </>
                        ) : (
                          <>
                            <span>Initialize Application</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </motion.button>

                    <div className="pt-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 leading-relaxed max-w-sm mx-auto">
                        By transmitting this application, you authorize adherence to our{" "}
                        <Link href="/writers/protocols" className="text-emerald-500 hover:text-emerald-400 underline decoration-emerald-500/30">Writer Protocols</Link>
                        {" "}and{" "}
                        <Link href="/writers/blueprints" className="text-emerald-500 hover:text-emerald-400 underline decoration-emerald-500/30">Privacy Blueprints</Link>
                      </p>
                    </div>
                  </form>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center mt-12 space-y-4"
              >
                <div className="w-px h-12 bg-gradient-to-b from-white/10 to-transparent mx-auto" />
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
                  Already part of the intelligence network?{" "}
                  <button
                    onClick={() => router.push("/writers/login")}
                    className="text-emerald-500 hover:text-emerald-400 underline decoration-emerald-500/30"
                  >
                    Enter Command Center
                  </button>
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WriterSignupPage;
