"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Calendar,
  Briefcase,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Target,
  Zap,
  CheckCircle,
  Rocket,
  BookOpen,
  GraduationCap,
  Building2,
  Search,
  ShieldCheck,
} from "lucide-react";
import { ButtonLoader } from "@/components/ui/Loader";

const quickOnboardingSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  role: z.enum(["FREELANCER", "STUDENT", "COMPANY", "JOB_SEEKER", "INSTRUCTOR"]),
  interests: z.string().optional(),
});

type QuickOnboardingFormType = z.infer<typeof quickOnboardingSchema>;

export default function QuickOnboardingForm({ session }: { session: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showInterestsDropdown, setShowInterestsDropdown] = useState(false);
  const interestsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        interestsDropdownRef.current &&
        !interestsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowInterestsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<QuickOnboardingFormType>({
    resolver: zodResolver(quickOnboardingSchema),
    mode: "onChange",
    defaultValues: {
      firstName: session?.user?.name?.split(" ")[0] || "",
      lastName: session?.user?.name?.split(" ")[1] || "",
      phone: "",
      dateOfBirth: "",
      // No default role so user must explicitly pick one
      interests: "",
    },
  });

  const watchedRole = watch("role");
  const watchedInterests = watch("interests");

  const interestsOptions = [
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Digital Marketing",
    "Content Writing",
    "Graphic Design",
    "Data Science",
    "Artificial Intelligence",
    "Project Management",
    "Customer Service",
  ];

  const onSubmit = async (data: QuickOnboardingFormType) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          isProfileComplete: true,
          bio: data.interests || "",
          serviceArea: "",
          servicesOffered: [],
          isAvailable: true,
          availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          availabilitySlots: [],
          location: {
            type: "Point",
            coordinates: [0, 0],
          },
        }),
      });

      if (!res.ok) throw new Error("Profile update failed");
      router.push("/dealoforge/dashboard");
    } catch (err: any) {
      console.error("Onboarding error:", err);
      router.push("/dealoforge/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    {
      value: "FREELANCER",
      label: "Freelancer",
      description: "Offer your skills and services to clients worldwide",
      icon: Rocket,
      gradient: "from-emerald-400 to-green-600",
    },
    {
      value: "STUDENT",
      label: "Student",
      description: "Learn high-demand skills and grow your career",
      icon: BookOpen,
      gradient: "from-green-400 to-teal-600",
    },
    {
      value: "INSTRUCTOR",
      label: "Instructor",
      description: "Share your knowledge and mentor the community",
      icon: GraduationCap,
      gradient: "from-emerald-500 to-green-700",
    },
    {
      value: "COMPANY",
      label: "Company",
      description: "Post projects and find top-tier talent fast",
      icon: Building2,
      gradient: "from-teal-500 to-emerald-700",
    },
  ];

  const handleNextStep = async () => {
    const fieldsToValidate: (keyof QuickOnboardingFormType)[] =
      step === 1 ? ["firstName", "lastName", "phone", "dateOfBirth"] : ["role"];

    const isValidStep = await trigger(fieldsToValidate);
    if (isValidStep) {
      setStep(next => Math.min(next + 1, 2));
    }
  };

  const handleRoleSelect = (roleValue: string) => {
    setValue("role", roleValue as any);
    trigger("role");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="w-full relative">
      {/* Premium Backdrop Glow */}
      <div className="absolute -top-40 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        {/* Modern Progress Indicator */}
        <div className="mb-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Onboarding Progress
              </h3>
              <p className="text-gray-400 text-sm">Fine-tuning your workspace experience</p>
            </div>
            <div className="text-right">
              <span className="text-emerald-400 font-mono text-xl font-bold">{step === 1 ? '50%' : '100%'}</span>
              <p className="text-gray-500 text-xs uppercase tracking-widest">Complete</p>
            </div>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 ring-1 ring-white/5 backdrop-blur-3xl">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: step === 1 ? "50%" : "100%" }}
              className="h-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 shadow-[0_0_20px_rgba(52,211,153,0.3)]"
              transition={{ duration: 1, ease: "circOut" }}
            />
          </div>
        </div>

        {/* Premium Form Glassmorphism */}
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-8 sm:p-12 shadow-2xl ring-1 ring-white/10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="personal-info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* First Name */}
                    <motion.div variants={itemVariants} className="space-y-3">
                      <label className="text-white text-sm font-medium ml-1 flex items-center gap-2">
                        First Name <span className="text-emerald-400 font-mono text-xs opacity-50">• Required</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        </div>
                        <input
                          {...register("firstName")}
                          className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all hover:bg-white/[0.07]"
                          placeholder="Your first name"
                        />
                      </div>
                      {errors.firstName && <p className="text-red-400 text-xs mt-1 ml-1">{errors.firstName.message}</p>}
                    </motion.div>

                    {/* Last Name */}
                    <motion.div variants={itemVariants} className="space-y-3">
                      <label className="text-white text-sm font-medium ml-1">Last Name</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        </div>
                        <input
                          {...register("lastName")}
                          className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all hover:bg-white/[0.07]"
                          placeholder="Your last name"
                        />
                      </div>
                      {errors.lastName && <p className="text-red-400 text-xs mt-1 ml-1">{errors.lastName.message}</p>}
                    </motion.div>

                    {/* Phone */}
                    <motion.div variants={itemVariants} className="space-y-3">
                      <label className="text-white text-sm font-medium ml-1">Phone Number</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        </div>
                        <input
                          {...register("phone")}
                          className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all hover:bg-white/[0.07]"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs mt-1 ml-1">{errors.phone.message}</p>}
                    </motion.div>

                    {/* DOB */}
                    <motion.div variants={itemVariants} className="space-y-3">
                      <label className="text-white text-sm font-medium ml-1">Date of Birth</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        </div>
                        <input
                          {...register("dateOfBirth")}
                          type="date"
                          className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all hover:bg-white/[0.07]"
                        />
                      </div>
                      {errors.dateOfBirth && <p className="text-red-400 text-xs mt-1 ml-1">{errors.dateOfBirth.message}</p>}
                    </motion.div>
                  </div>

                  <div className="pt-8 border-t border-white/10 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleNextStep}
                      className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-[1.25rem] shadow-xl shadow-emerald-500/20 flex items-center gap-3 group transition-all hover:shadow-emerald-500/40"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="role-selection"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  {/* Hidden field to register role with react-hook-form */}
                  <input type="hidden" {...register("role")} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    {roleOptions.map((role, idx) => (
                      <motion.div
                        key={role.value}
                        variants={itemVariants}
                        onClick={() => handleRoleSelect(role.value)}
                        className={`relative p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${watchedRole === role.value
                            ? "bg-emerald-500/10 border-emerald-500 ring-4 ring-emerald-500/20"
                            : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"
                          }`}
                      >
                        <div className="flex items-start gap-5">
                          <div className={`p-4 rounded-2xl bg-gradient-to-br ${role.gradient} shadow-lg shadow-emerald-500/20`}>
                            <role.icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="pr-8">
                            <h4 className="text-white font-bold text-xl mb-1">{role.label}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{role.description}</p>
                          </div>
                          {watchedRole === role.value && (
                            <div className="absolute top-6 right-6">
                              <CheckCircle className="w-6 h-6 text-emerald-400" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {errors.role && (
                    <p className="text-red-400 text-xs mt-2 ml-1">
                      {errors.role.message || "Please select a role to continue."}
                    </p>
                  )}

                  {/* Interests Dropdown */}
                  <div className="space-y-4 relative" ref={interestsDropdownRef}>
                    <label className="text-white text-sm font-medium ml-1">Primary Skill / Interest</label>
                    <button
                      type="button"
                      onClick={() => setShowInterestsDropdown(!showInterestsDropdown)}
                      className="w-full flex items-center justify-between px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white group hover:bg-white/10 transition-all focus:ring-2 focus:ring-emerald-500/50"
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                        <span className={watchedInterests ? "text-white" : "text-gray-500 font-medium"}>
                          {watchedInterests || "Select your main expertise area"}
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showInterestsDropdown ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {showInterestsDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          className="absolute bottom-full mb-4 w-full bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {interestsOptions.map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => {
                                  setValue("interests", option);
                                  setShowInterestsDropdown(false);
                                }}
                                className="px-5 py-3 text-left text-sm text-gray-300 hover:bg-emerald-500 hover:text-white rounded-xl transition-all font-medium"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="pt-8 border-t border-white/10 flex justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-8 py-4 border border-white/10 text-white font-bold rounded-[1.25rem] hover:bg-white/5 transition-all flex items-center gap-2 group"
                    >
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      Back
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 max-w-sm px-10 py-5 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 text-white font-black text-lg uppercase tracking-wider rounded-[1.25rem] shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 hover:shadow-emerald-500/40 relative overflow-hidden group disabled:opacity-50"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                      {isLoading ? <ButtonLoader text="Initializing Workspace..." /> : (
                        <>
                          Complete Setup
                          <Zap className="w-6 h-6 fill-white" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>

      {/* Decorative Floating Elements */}
      <div className="absolute top-1/2 -right-20 w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-20 pointer-events-none" />
      <div className="absolute bottom-1/3 -left-10 w-3 h-3 bg-green-400 rounded-full animate-pulse delay-700 opacity-20 pointer-events-none" />
    </div>
  );
}
