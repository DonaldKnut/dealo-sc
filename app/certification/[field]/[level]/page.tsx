"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeSession } from "@/hooks/use-safe-session";
import {
  BookOpen,
  Clock,
  Star,
  CheckCircle,
  Award,
  ArrowLeft,
  Play,
  Lock,
  Users,
  Target,
  Zap,
  Shield,
  Sparkles,
  Trophy,
  TrendingUp,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface Certification {
  _id: string;
  title: string;
  description: string;
  field: string;
  level: string;
  duration: number;
  questions: number;
  passingScore: number;
  isCompleted?: boolean;
  userScore?: number;
  completedAt?: Date;
}

const LEVEL_CONFIG: Record<string, { color: string; bg: string; border: string; glow: string; label: string; desc: string }> = {
  beginner: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", glow: "shadow-emerald-500/20", label: "Beginner", desc: "Perfect for newcomers to the field" },
  intermediate: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", glow: "shadow-blue-500/20", label: "Intermediate", desc: "For those with some experience" },
  advanced: { color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/30", glow: "shadow-violet-500/20", label: "Advanced", desc: "For experienced professionals" },
  expert: { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", glow: "shadow-rose-500/20", label: "Expert", desc: "For industry experts" },
};

const WHAT_YOULL_LEARN = (field: string) => [
  `Core concepts and fundamentals of ${field}`,
  "Practical skills and real-world applications",
  "Industry best practices and standards",
  "Problem-solving and critical thinking",
  "Tools and workflows used by professionals",
  "Portfolio-ready project techniques",
];

const REQUIREMENTS = [
  "A stable internet connection for the assessment",
  "Dedicated time to complete the certification",
  "Basic understanding of the field (intermediate+)",
  "Willingness to learn and be challenged",
];

const BENEFITS = [
  { icon: <Trophy className="w-5 h-5" />, title: "Professional Recognition", desc: "Stand out with an industry-recognized credential on your profile" },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Career Advancement", desc: "Open doors to new opportunities and higher-paying positions" },
  { icon: <Zap className="w-5 h-5" />, title: "Skill Validation", desc: "Prove your expertise and build confidence in your abilities" },
];

const CertificationFieldLevelPage = () => {
  const params = useParams();
  const router = useRouter();
  const session = useSafeSession();
  const { data: sessionData, status } = session || {};
  const field = params.field as string;
  const level = params.level as string;

  const [certification, setCertification] = useState<Certification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lvl = LEVEL_CONFIG[level?.toLowerCase()] || LEVEL_CONFIG.beginner;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in?callbackUrl=" + encodeURIComponent(window.location.pathname));
      return;
    }
    if (status === "loading") return;

    const fetchCertification = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/certifications/${field}/${level}`);
        if (response.status === 401) {
          router.push("/sign-in?callbackUrl=" + encodeURIComponent(window.location.pathname));
          return;
        }
        if (response.ok) {
          const data = await response.json();
          setCertification(data.data);
        } else {
          setError("Certification not found");
        }
      } catch {
        setError("Failed to load certification");
      } finally {
        setLoading(false);
      }
    };

    if (field && level && status === "authenticated") fetchCertification();
  }, [field, level, status, router]);

  const handleStartCertification = () => {
    if (!sessionData?.user) {
      router.push("/sign-in?callbackUrl=" + encodeURIComponent(window.location.pathname));
      return;
    }
    router.push(`/certification/${field}/${level}/assessment`);
  };

  // Loading
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin relative" />
          </div>
          <p className="text-gray-500 text-sm font-medium">Loading certification...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error || !certification) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto">
            <Shield className="w-10 h-10 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white mb-2">Certification Not Found</h1>
            <p className="text-gray-500">{error || "The requested certification could not be found."}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/certifications/explore")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Explore Certifications
            </button>
            <button
              onClick={() => router.push("/certification")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.05] border border-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-all"
            >
              My Certifications
            </button>
          </div>
        </div>
      </div>
    );
  }

  const durationMins = Math.round(certification.duration / 60);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">

      {/* ── AMBIENT BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-emerald-500/5 blur-[160px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-green-500/4 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">

        {/* ── HERO ── */}
        <section className="relative pt-28 pb-20 px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto">

            {/* Breadcrumb */}
            <motion.button
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => router.push("/certifications/explore")}
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-10 group text-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Certifications
            </motion.button>

            <div className="grid lg:grid-cols-[1fr_340px] gap-12 items-start">

              {/* Left: Title + Description */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Level badge */}
                <div className="flex items-center gap-3 mb-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${lvl.color} ${lvl.bg} ${lvl.border}`}>
                    <Sparkles className="w-3 h-3" />
                    {lvl.label}
                  </span>
                  <span className="text-gray-600 text-xs capitalize">{field} · {lvl.desc}</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.92] mb-6">
                  {certification.title}
                </h1>

                <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl">
                  {certification.description}
                </p>

                {/* Completed badge */}
                {certification.isCompleted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-3 px-5 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl mb-6"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">
                      Completed — you scored {certification.userScore}%
                    </span>
                  </motion.div>
                )}

                {/* Quick stats row */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {[
                    { icon: <Clock className="w-4 h-4" />, label: `${durationMins} min` },
                    { icon: <BookOpen className="w-4 h-4" />, label: `${certification.questions} questions` },
                    { icon: <Target className="w-4 h-4" />, label: `${certification.passingScore}% to pass` },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-gray-600">{s.icon}</span>
                      {s.label}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right: CTA Card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="lg:sticky lg:top-24"
              >
                <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-[2rem] p-7 overflow-hidden">
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

                  {/* Stat grid */}
                  <div className="grid grid-cols-2 gap-3 mb-7">
                    {[
                      { icon: <Clock className="w-4 h-4" />, value: `${durationMins} min`, label: "Duration", color: "text-emerald-400" },
                      { icon: <BookOpen className="w-4 h-4" />, value: certification.questions, label: "Questions", color: "text-blue-400" },
                      { icon: <Target className="w-4 h-4" />, value: `${certification.passingScore}%`, label: "Pass Score", color: "text-violet-400" },
                      { icon: <Award className="w-4 h-4" />, value: certification.isCompleted ? "Done ✓" : "Ready", label: "Status", color: "text-amber-400" },
                    ].map((s, i) => (
                      <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
                        <div className={`flex items-center gap-1.5 mb-2 ${s.color}`}>
                          {s.icon}
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{s.label}</span>
                        </div>
                        <p className="text-xl font-black text-white">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  {certification.isCompleted ? (
                    <button
                      onClick={handleStartCertification}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-white/[0.05] border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-white font-bold rounded-2xl transition-all duration-300 group"
                    >
                      <Play className="w-5 h-5 text-emerald-400" />
                      Retake Assessment
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ) : (
                    <button
                      onClick={handleStartCertification}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl transition-all duration-300 shadow-2xl shadow-emerald-900/40 group active:scale-[0.98]"
                    >
                      <Play className="w-5 h-5" />
                      Start Certification
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}

                  <p className="text-center text-gray-600 text-xs mt-4">
                    Free to attempt · Certificate on completion
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CONTENT SECTIONS ── */}
        <section className="px-6 pb-24">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* What You'll Learn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.02] border border-white/[0.07] rounded-[2rem] p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-black">What You'll Learn</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {WHAT_YOULL_LEARN(field).map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
                  >
                    <div className="w-5 h-5 bg-emerald-500/15 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-500/25 transition-colors">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.02] border border-white/[0.07] rounded-[2rem] p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 bg-white/[0.05] border border-white/10 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-gray-400" />
                </div>
                <h2 className="text-xl font-black">Requirements</h2>
              </div>
              <div className="space-y-3">
                {REQUIREMENTS.map((req, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-400 text-sm leading-relaxed">{req}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[2rem]"
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/60 via-black to-black" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
              <div className="absolute top-0 left-0 w-[300px] h-[200px] bg-emerald-500/10 blur-[80px] rounded-full" />

              <div className="relative p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-black">Certification Benefits</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {BENEFITS.map((b, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white/[0.04] border border-white/[0.08] hover:border-emerald-500/20 rounded-2xl p-6 transition-all duration-300 group hover:bg-emerald-500/[0.04]"
                    >
                      <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                        {b.icon}
                      </div>
                      <h3 className="font-bold text-white mb-2 text-sm">{b.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{b.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Bottom CTA */}
            {!certification.isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center py-8"
              >
                <button
                  onClick={handleStartCertification}
                  className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-2xl shadow-emerald-900/40 group active:scale-[0.98]"
                >
                  <Play className="w-5 h-5" />
                  Start Your Certification
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <p className="text-gray-600 text-xs mt-4">Free to attempt · Earn your certificate today</p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CertificationFieldLevelPage;
