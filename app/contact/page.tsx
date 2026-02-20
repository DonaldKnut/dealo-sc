"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  MessageSquare,
  Sparkles,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    subject: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: data.message || "Your message has been transmitted through the network.",
        });
        setFormData({ name: "", email: "", message: "", subject: "" });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Transmission failed. Sync error detected.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Neural link disruption. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 overflow-hidden relative">

      {/* ── AMBIENT BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
      </div>

      <main className="relative z-10 pt-32 pb-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* ── HERO TEXT ── */}
          <section className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black uppercase tracking-[0.34em] text-emerald-400 mb-10 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            >
              <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
              Global Support
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.85] uppercase"
            >
              GET IN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600">
                TOUCH
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/40 text-sm md:text-base font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto leading-loose"
            >
              Whether you're looking to scale your team or launch your creator legacy, our neural support network is here to assist.
            </motion.p>
          </section>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* ── LEFT: CONTACT FORM ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative p-1 rounded-[3.5rem] bg-gradient-to-br from-emerald-500/20 to-transparent shadow-2xl"
            >
              <div className="p-8 md:p-12 lg:p-16 rounded-[3.4rem] bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Identity</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/[0.06] transition-all font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">E-Mail Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/[0.06] transition-all font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Inquiry Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Enterprise Inquiry"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/[0.06] transition-all font-bold"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Message Transmission</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Describe your vision..."
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/[0.06] transition-all font-bold resize-none"
                      required
                    ></textarea>
                  </div>

                  <AnimatePresence mode="wait">
                    {submitStatus.type && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`flex items-center gap-3 p-4 rounded-2xl mb-4 ${submitStatus.type === "success"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                      >
                        {submitStatus.type === "success" ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <AlertCircle className="w-5 h-5" />
                        )}
                        <span className="text-xs font-black uppercase tracking-widest leading-none">
                          {submitStatus.message}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    className="w-full py-6 rounded-2xl bg-emerald-500 text-black text-xs font-black uppercase tracking-[0.34em] hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-95 disabled:opacity-50 group overflow-hidden relative"
                    disabled={isSubmitting}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        Initialize Link <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* ── RIGHT: SUPPORT INFO ── */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="grid gap-6"
              >
                {[
                  {
                    title: "Neural Mail",
                    detail: "dealogroupincorporated@gmail.com",
                    icon: Mail,
                    href: "mailto:dealogroupincorporated@gmail.com"
                  },
                  {
                    title: "Direct Secure Line",
                    detail: "+234 815 706 2795",
                    icon: Phone,
                    href: "tel:+2348157062795"
                  },
                  {
                    title: "Physical Hub",
                    detail: "23A, Bashorun Okusanya St. Lekki Phase 1, Lagos",
                    icon: MapPin,
                    href: "#"
                  },
                  {
                    title: "Professional Network",
                    detail: "Dealo Group Incorporated",
                    icon: Linkedin,
                    href: "https://www.linkedin.com/company/dealo-group-incorporation/"
                  }
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group"
                  >
                    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all duration-500 shadow-xl flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                          <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-emerald-500/60 transition-colors mb-1">{item.title}</p>
                          <h3 className="text-sm font-bold text-white group-hover:text-white transition-colors">{item.detail}</h3>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-white/5 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </motion.div>

              {/* Support Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-10 rounded-[2.5rem] bg-emerald-500 text-black relative overflow-hidden group shadow-[0_0_50px_rgba(16,185,129,0.2)]"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-black/10 rounded-full -mr-24 -mt-24 blur-2xl group-hover:scale-125 transition-transform duration-700" />
                <div className="relative z-10 space-y-4">
                  <MessageSquare className="w-10 h-10 mb-4" />
                  <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">Instant <br />Resolution</h3>
                  <p className="text-black/60 font-bold text-sm uppercase tracking-widest leading-relaxed">Average response time: 2.4 Neural Cycles</p>
                  <Link
                    href="/faq"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] border-b-2 border-black/20 hover:border-black transition-all pt-2"
                  >
                    Knowledge Base <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
