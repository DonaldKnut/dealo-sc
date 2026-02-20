"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Shield,
  Users,
  Award,
  BookOpen,
  Zap,
  PenTool,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
;

const writerLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type WriterLoginFormType = z.infer<typeof writerLoginSchema>;

const WriterLoginForm = () => {
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
  } = useForm<WriterLoginFormType>({
    resolver: zodResolver(writerLoginSchema),
  });

  const onSubmit = async (data: WriterLoginFormType) => {
    setIsLoading(true);
    setNotification(null);

    try {
      const response = await fetch("/api/writers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Login failed");
      }

      setNotification({
        message: "Login successful! Redirecting to dashboard...",
        type: "success",
      });

      setTimeout(() => {
        router.push("/writers/dashboard");
      }, 1500);
    } catch (error) {
      setNotification({
        message: error instanceof Error ? error.message : "Login failed",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute -inset-px bg-emerald-500/10 blur-[100px] rounded-[3rem] opacity-30" />
      <div className="relative bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 md:p-14 shadow-2xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/[0.03] border border-white/10 rounded-2xl mb-6">
            <Shield className="w-7 h-7 text-emerald-500" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-2">Initialize Credentials</h2>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Establish Secure Linkage</p>
        </div>

        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl mb-8 flex items-center gap-4 ${notification.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{notification.message}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Archive ID: Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                <input
                  {...register("email")}
                  type="email"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700"
                  placeholder="Enter secure ID"
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-400 font-black uppercase tracking-widest ml-1 mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Access Cipher: Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-16 py-4 text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700"
                  placeholder="Enter complex cipher"
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
          </div>

          <div className="space-y-6 pt-4">
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
                    <span>Establishing Link...</span>
                  </>
                ) : (
                  <>
                    <span>Establish Access</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </motion.button>

            <div className="text-center space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 leading-relaxed">
                New operative?{" "}
                <Link
                  href="/writers/signup"
                  className="text-emerald-500 hover:text-emerald-400 underline decoration-emerald-500/30"
                >
                  Request Access Authorization
                </Link>
              </p>
              <div className="w-8 h-px bg-white/10 mx-auto" />
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                Exit To Perimeter
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const WriterLoginPage = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 overflow-hidden flex flex-col items-center justify-center p-6 relative">
      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[60%] h-[60%] bg-emerald-500/5 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[10%] w-[60%] h-[60%] bg-green-500/5 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-125 contrast-150" />
      </div>

      <main className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
        {/* ── LEFT: PROMO/TITLING ── */}
        <div className="lg:col-span-6 space-y-12">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center gap-6"
            >
              <div className="w-12 h-px bg-emerald-500" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500">Security Clearance Required</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic"
            >
              Command <br />
              <span className="text-emerald-500">Center</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-gray-500 text-lg md:text-xl font-medium max-w-md leading-relaxed"
            >
              Initialize access to the archives. Securely deploy intelligence and orchestrate global professional growth.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8">
            {[
              { icon: <PenTool className="w-5 h-5" />, label: "Deploy Intel", sub: "Global Reach" },
              { icon: <Zap className="w-5 h-5" />, label: "Compute Logic", sub: "AI Integration" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="space-y-2 group"
              >
                <div className="w-10 h-10 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest">{stat.label}</h3>
                  <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest">{stat.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: LOGIN FORM ── */}
        <div className="lg:col-span-6">
          <Suspense fallback={<div>Loading...</div>}>
            <WriterLoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default WriterLoginPage;
