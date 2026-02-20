"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Building, Target, Clock, DollarSign, CheckCircle,
  ArrowRight, Shield, Zap, TrendingUp, Award, Send,
  Briefcase, Globe, Star, UserPlus, AlertCircle, Loader2,
  Sparkles, ChevronRight, BarChart3, Headphones, Lock,
} from "lucide-react";
import Link from "next/link";


// ─── DATA ────────────────────────────────────────────────────────────────────

const PACKAGES = [
  {
    id: "starter",
    name: "Starter Team",
    price: "₦500,000",
    team: "5–10 Professionals",
    duration: "2–4 weeks",
    icon: UserPlus,
    color: "from-blue-500 to-blue-600",
    popular: false,
    features: [
      "Pre-vetted candidates",
      "Basic skill assessment",
      "Standard onboarding",
      "30-day replacement guarantee",
      "Email support",
    ],
  },
  {
    id: "standard",
    name: "Standard Team",
    price: "₦1,500,000",
    team: "11–25 Professionals",
    duration: "3–6 weeks",
    icon: Users,
    color: "from-emerald-500 to-green-600",
    popular: true,
    features: [
      "Thoroughly vetted candidates",
      "Advanced skill testing",
      "Custom onboarding program",
      "60-day replacement guarantee",
      "Dedicated account manager",
      "Priority support",
      "Team integration support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Solution",
    price: "Custom Pricing",
    team: "26+ Professionals",
    duration: "Custom Timeline",
    icon: Building,
    color: "from-violet-500 to-purple-600",
    popular: false,
    features: [
      "Executive-level vetting",
      "Comprehensive assessments",
      "Tailored onboarding & training",
      "90-day replacement guarantee",
      "Dedicated hiring team",
      "24/7 premium support",
      "Ongoing team management",
      "Performance analytics",
      "Legal & compliance support",
    ],
  },
];

const HIRING_MODELS = [
  {
    title: "Full-Time Teams",
    description: "Build permanent teams for long-term growth",
    icon: Briefcase,
    color: "from-emerald-500 to-green-600",
    benefits: ["Long-term commitment", "Culture integration", "Full benefits"],
  },
  {
    title: "Project-Based",
    description: "Hire specialists for specific projects",
    icon: Target,
    color: "from-blue-500 to-cyan-600",
    benefits: ["Flexible duration", "Cost-effective", "Specialised expertise"],
  },
  {
    title: "Outsourced Ops",
    description: "Let us manage entire departments",
    icon: Globe,
    color: "from-violet-500 to-purple-600",
    benefits: ["Complete management", "Infrastructure included", "Scalable"],
  },
  {
    title: "Contract Teams",
    description: "Temporary teams for seasonal needs",
    icon: Clock,
    color: "from-orange-500 to-amber-600",
    benefits: ["Short-term flexibility", "Quick deployment", "No overhead"],
  },
];

const WHY_DEALO = [
  { icon: Shield, title: "Pre-Vetted Talent", desc: "Every professional passes rigorous screening and skill verification", color: "from-blue-500 to-blue-600" },
  { icon: Zap, title: "Fast Deployment", desc: "Get your team up and running in as little as 2 weeks", color: "from-yellow-500 to-amber-600" },
  { icon: DollarSign, title: "Cost Effective", desc: "Save up to 60% compared to traditional recruitment agencies", color: "from-emerald-500 to-green-600" },
  { icon: Award, title: "Quality Guarantee", desc: "Free replacements if any hire doesn't meet your standards", color: "from-violet-500 to-purple-600" },
  { icon: Headphones, title: "Dedicated Support", desc: "Personal account manager to handle all your hiring needs", color: "from-pink-500 to-rose-600" },
  { icon: TrendingUp, title: "Scalable Solutions", desc: "Easily scale your team up or down based on business needs", color: "from-orange-500 to-amber-600" },
];

const STATS = [
  { value: "500+", label: "Companies Served", icon: Building },
  { value: "10K+", label: "Professionals Placed", icon: Users },
  { value: "98%", label: "Success Rate", icon: CheckCircle },
  { value: "14 Days", label: "Avg. Time to Hire", icon: Clock },
];

const INDUSTRIES = [
  "Technology & IT", "Finance & Banking", "Healthcare", "E-commerce",
  "Manufacturing", "Education", "Real Estate", "Marketing & Advertising",
  "Hospitality", "Logistics", "Other",
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function BulkHiringPage() {
  const [selectedPackage, setSelectedPackage] = useState("standard");
  const [formData, setFormData] = useState({
    companyName: "", contactName: "", email: "", phone: "",
    industry: "", teamSize: "", hiringType: "full-time",
    budget: "", timeline: "", skills: "", description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const response = await fetch("/api/bulk-hiring/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, package: selectedPackage }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit request");
      setSubmitSuccess(true);
      setFormData({ companyName: "", contactName: "", email: "", phone: "", industry: "", teamSize: "", hiringType: "full-time", budget: "", timeline: "", skills: "", description: "" });
      setSelectedPackage("standard");
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      setSubmitError(error.message || "Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-5 py-3.5 bg-white/[0.04] border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all duration-300 text-sm font-medium";
  const labelClass = "block text-gray-400 text-xs font-black uppercase tracking-widest mb-2";

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">


      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f1a0f] to-black" />
        <div className="absolute top-[5%] left-[10%] w-[50%] h-[60%] bg-emerald-500/8 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-[5%] w-[35%] h-[40%] bg-green-600/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
              Enterprise Hiring Solutions
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.88]"
          >
            SCALE YOUR TEAM<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500">
              INSTANTLY
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Hire entire teams or outsource complete operations to Africa's most elite pre-vetted professionals. No hiring headaches.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#packages"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all duration-500 shadow-2xl shadow-emerald-900/40 group"
            >
              View Packages
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#request"
              className="inline-flex items-center gap-3 px-10 py-4 bg-white/[0.04] border border-white/10 hover:border-emerald-500/30 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all duration-500"
            >
              Request a Quote
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="border-y border-white/5 py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                <s.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-white mb-1">{s.value}</p>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HIRING MODELS ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              FLEXIBLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">HIRING MODELS</span>
            </h2>
            <p className="text-gray-500 text-lg">Choose the model that fits your business needs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {HIRING_MODELS.map((model, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 rounded-[2rem] p-8 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${model.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  <model.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-white mb-2 relative z-10">{model.title}</h3>
                <p className="text-gray-500 text-sm mb-6 relative z-10">{model.description}</p>
                <ul className="space-y-2 relative z-10">
                  {model.benefits.map((b, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-400 text-sm">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                      </div>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section id="packages" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              TRANSPARENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">PACKAGES</span>
            </h2>
            <p className="text-gray-500 text-lg">No hidden fees. Pay only for the team you need.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative ${pkg.popular ? "md:-mt-6" : ""}`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-t-[2.5rem]" />
                )}
                <div className={`bg-white/[0.03] backdrop-blur-xl border rounded-[2.5rem] p-8 h-full transition-all duration-500 group hover:border-emerald-500/30 relative overflow-hidden ${pkg.popular ? "border-emerald-500/30" : "border-white/10"}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {pkg.popular && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-6">
                      <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Most Popular</span>
                    </div>
                  )}

                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-5 shadow-lg`}>
                      <pkg.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-black mb-1">{pkg.name}</h3>
                    <p className="text-gray-500 text-sm mb-6">{pkg.team} · {pkg.duration}</p>
                    <p className="text-4xl font-black text-white mb-8">{pkg.price}</p>

                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                          </div>
                          <span className="text-gray-300 text-sm">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 group/btn ${selectedPackage === pkg.id || pkg.popular
                        ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-black shadow-2xl shadow-emerald-900/40"
                        : "bg-white/[0.05] border border-white/10 hover:border-emerald-500/30 text-white"
                        }`}
                    >
                      {pkg.id === "enterprise" ? "Contact Sales" : selectedPackage === pkg.id ? "Selected ✓" : "Select Package"}
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY DEALO ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              WHY COMPANIES <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">CHOOSE DEALO</span>
            </h2>
            <p className="text-gray-500 text-lg">We make bulk hiring simple, fast, and reliable</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_DEALO.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-emerald-500/25 rounded-[2rem] p-8 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-white mb-3 relative z-10">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed relative z-10">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REQUEST FORM ── */}
      <section id="request" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-black to-black" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              REQUEST A <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">CUSTOM QUOTE</span>
            </h2>
            <p className="text-gray-500 text-lg">Tell us your needs and we'll build a tailored solution within 24 hours.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10"
          >
            {/* Selected Package Indicator */}
            <div className="flex items-center gap-3 mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-400 text-xs font-black uppercase tracking-widest">Selected Package</p>
                <p className="text-white font-black text-sm capitalize">{selectedPackage} — {PACKAGES.find(p => p.id === selectedPackage)?.price}</p>
              </div>
              <a href="#packages" className="ml-auto text-xs font-black text-gray-500 hover:text-emerald-400 transition-colors">Change</a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Company Name *</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} required placeholder="Your company name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Contact Name *</label>
                  <input type="text" name="contactName" value={formData.contactName} onChange={handleInputChange} required placeholder="Your full name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="company@example.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+234 xxx xxx xxxx" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Industry *</label>
                  <select name="industry" value={formData.industry} onChange={handleInputChange} required className={`${inputClass} [&>option]:bg-[#0d1a0d]`}>
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Team Size *</label>
                  <select name="teamSize" value={formData.teamSize} onChange={handleInputChange} required className={`${inputClass} [&>option]:bg-[#0d1a0d]`}>
                    <option value="">Select team size</option>
                    <option value="5-10">5–10 professionals</option>
                    <option value="11-25">11–25 professionals</option>
                    <option value="26-50">26–50 professionals</option>
                    <option value="51+">51+ professionals</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Hiring Type *</label>
                  <select name="hiringType" value={formData.hiringType} onChange={handleInputChange} required className={`${inputClass} [&>option]:bg-[#0d1a0d]`}>
                    <option value="full-time">Full-Time</option>
                    <option value="project-based">Project-Based</option>
                    <option value="contract">Contract</option>
                    <option value="outsourcing">Full Outsourcing</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Timeline *</label>
                  <select name="timeline" value={formData.timeline} onChange={handleInputChange} required className={`${inputClass} [&>option]:bg-[#0d1a0d]`}>
                    <option value="">When do you need them?</option>
                    <option value="urgent">Urgent (1–2 weeks)</option>
                    <option value="1-month">Within 1 month</option>
                    <option value="2-3-months">2–3 months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Required Skills *</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleInputChange} required placeholder="e.g., JavaScript, React, Node.js, Project Management" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Project Description *</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={5} placeholder="Tell us about your project, team requirements, and any specific needs..." className={`${inputClass} resize-none`} />
              </div>

              <div>
                <label className={labelClass}>Budget Range (Optional)</label>
                <input type="text" name="budget" value={formData.budget} onChange={handleInputChange} placeholder="e.g., ₦1,000,000 – ₦5,000,000" className={inputClass} />
              </div>

              {/* Feedback Messages */}
              <AnimatePresence>
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{submitError}</span>
                  </motion.div>
                )}
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400"
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Request submitted! Our team will contact you within 24 hours.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 px-8 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-black font-black uppercase tracking-widest text-sm rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 shadow-2xl shadow-emerald-900/40 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Request
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-center text-gray-600 text-xs">
                By submitting, you agree to our{" "}
                <Link href="/terms" className="text-emerald-500 hover:text-emerald-400 transition-colors">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-emerald-500 hover:text-emerald-400 transition-colors">Privacy Policy</Link>.
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="border-t border-white/5 py-10 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-10">
          {[
            { icon: Shield, label: "Bank-grade Security" },
            { icon: Lock, label: "Data Protected" },
            { icon: Headphones, label: "24/7 Support" },
            { icon: Globe, label: "120+ Countries" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-gray-500 text-sm font-bold">{item.label}</span>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
}
