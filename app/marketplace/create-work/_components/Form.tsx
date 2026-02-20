"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categories, Work, workSchema } from "../(data)/validationSchemas";
import {
  Edit2,
  Image as ImageIcon,
  DollarSign,
  Calendar,
  Clock,
  Mail,
  Globe,
  Bookmark,
  Briefcase,
  Award,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import FileUploader from "./FileUploader";
import ClipLoader from "react-spinners/ClipLoader";
import SkillsInput from "@/components/forms/_components/SkillsInput";
import Notification from "./../../../../components/Notification"; // Import the Notification component
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface FormProps {
  type: "Create" | "Edit";
  work?: Work;
  setWork?: React.Dispatch<React.SetStateAction<Work>>;
  handleSubmit: (data: Work) => void;
}

const Form: React.FC<FormProps> = ({ type, handleSubmit }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [notification, setNotification] = useState<{
    message: string | null;
    type: "success" | "error";
  }>({ message: null, type: "success" });

  const {
    register,
    handleSubmit: processSubmission,
    setValue,
    watch,
    formState: { errors, isValid },
    control,
    trigger,
  } = useForm<Work>({
    resolver: zodResolver(workSchema),
    mode: "onChange",
    defaultValues: {
      category: "All",
      workMedia: [],
      title: "",
      price: 0,
      skills: [],
      description: "",
      deliveryDate: "",
      deliveryTime: "",
      contactInfo: { email: "", phone: "" },
      languagesSpoken: [],
      experienceLevel: "Junior",
      portfolioLink: "",
      certifications: [],
    },
  });

  const formValues = watch();

  const handleNext = async () => {
    if (currentStep === 1) {
      // Validate title
      const title = formValues.title?.trim();
      if (!title || title.length < 1) {
        await trigger(["title"]);
        return;
      }
      // Validate description — strip HTML tags from Quill output before checking
      const rawDesc = formValues.description || "";
      const strippedDesc = rawDesc.replace(/<[^>]*>/g, "").trim();
      if (strippedDesc.length < 10) {
        setNotification({
          message: "Please write a description of at least 10 characters.",
          type: "error",
        });
        return;
      }
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === 2) {
      // Validate price and delivery date/time
      const price = formValues.price;
      const deliveryDate = formValues.deliveryDate;
      const deliveryTime = formValues.deliveryTime;
      const workMedia = formValues.workMedia;

      if (!price || Number(price) <= 0) {
        await trigger(["price"]);
        setNotification({ message: "Please enter a valid price greater than 0.", type: "error" });
        return;
      }
      if (!deliveryDate) {
        setNotification({ message: "Please select a delivery date.", type: "error" });
        return;
      }
      if (!deliveryTime) {
        setNotification({ message: "Please select a delivery time.", type: "error" });
        return;
      }
      // NEW: Validate media before allowing to proceed to Step 3
      if (!workMedia || workMedia.length === 0) {
        setNotification({ message: "At least one media file is required to showcase your work.", type: "error" });
        return;
      }
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFormSubmit = async (data: Work) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/work/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setNotification({
          message: result.error || "Failed to submit form.",
          type: "error",
        });
      } else {
        setNotification({
          message: "Work created successfully!",
          type: "success",
        });
        setTimeout(() => {
          router.push(
            `/marketplace?category=${encodeURIComponent(data.category)}`
          );
        }, 2000);
      }
    } catch (error) {
      setNotification({
        message: "An unexpected error occurred.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ message: null, type: "success" });
  };

  const steps = [
    { id: 1, name: "Basics", icon: Edit2 },
    { id: 2, name: "Impact", icon: ImageIcon },
    { id: 3, name: "Expertise", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-black py-20 px-4 relative overflow-hidden pt-32">
      {/* Background Cinematic Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_70%)]" />
        <div className="absolute top-[20%] -right-1/4 w-1/2 h-1/2 bg-emerald-500/5 blur-[160px] rounded-full" />
        <div className="absolute bottom-[20%] -left-1/4 w-1/2 h-1/2 bg-green-500/5 blur-[160px] rounded-full" />
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />

      <div className="max-w-4xl mx-auto relative z-10 text-white">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-[9px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-6 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Sparkles className="w-3 h-3" />
            OPERATIONAL PHASE: 0{currentStep}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20 uppercase leading-[0.9]">
            {type === "Create" ? (
              <>FORGE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">SERVICE</span></>
            ) : (
              <>EDIT YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">IMPACT</span></>
            )}
          </h1>
          <p className="text-white/30 font-bold uppercase tracking-[0.25em] text-[10px] mt-4">
            Constructing high-impact market manifestations for global deployment.
          </p>
        </motion.div>

        {/* Multi-Step Progress Indicator */}
        <div className="flex justify-between items-center mb-20 relative px-4">
          <div className="absolute top-1/2 left-4 right-4 h-px bg-white/5 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-4 h-px bg-gradient-to-r from-emerald-500 to-green-500 -translate-y-1/2 z-0 transition-all duration-700 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            style={{ width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 32px)` }}
          />

          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <motion.div
                animate={{
                  scale: currentStep === step.id ? 1.15 : 1,
                  backgroundColor: currentStep >= step.id ? "rgba(16, 185, 129, 1)" : "rgba(255, 255, 255, 0.02)",
                  borderColor: currentStep >= step.id ? "rgba(16, 185, 129, 0.5)" : "rgba(255, 255, 255, 0.05)",
                }}
                className="w-14 h-14 rounded-[1.25rem] border flex items-center justify-center transition-all duration-500 shadow-2xl backdrop-blur-3xl"
              >
                <step.icon className={`w-6 h-6 ${currentStep >= step.id ? "text-black" : "text-white/20"}`} />
              </motion.div>
              <span className={`mt-5 text-[9px] font-black uppercase tracking-[0.2em] ${currentStep >= step.id ? "text-emerald-400" : "text-white/20"}`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] backdrop-blur-[40px] border border-white/[0.05] rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden group"
        >
          {/* Internal Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <form
            onSubmit={processSubmission(handleFormSubmit, (errors) => {
              console.error("Form validation errors:", errors);

              if (errors.title || errors.category || errors.description) {
                setCurrentStep(1);
              } else if (errors.price || errors.deliveryDate || errors.deliveryTime || errors.workMedia) {
                setCurrentStep(2);
              } else {
                setCurrentStep(3);
              }

              const firstError = Object.values(errors)[0];
              if (firstError) {
                setNotification({
                  message: firstError.message?.toString() || "Validation error encountered.",
                  type: "error",
                });
              }
            })}
            className="space-y-12"
          >
            {/* Step 1: Basics */}
            {currentStep === 1 && (
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-black tracking-tight flex items-center gap-4 text-white">
                    <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">01</span>
                    CORE MANIFESTATION
                  </h3>
                  <div className="space-y-8">
                    <div className="relative group/field">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4 block group-focus-within/field:text-emerald-500 transition-colors">Manifestation Title</label>
                      <input
                        type="text"
                        {...register("title")}
                        placeholder="e.g. CINEMATIC VISUAL COORDINATION"
                        className={`w-full bg-white/[0.03] border border-white/[0.08] p-6 rounded-[1.5rem] text-white placeholder:text-white/10 outline-none focus:border-emerald-500/40 focus:bg-white/[0.05] transition-all font-bold uppercase tracking-wider text-sm ${errors.title ? "border-red-500/50" : ""}`}
                      />
                      {errors.title && <p className="text-red-500/70 text-[10px] mt-2 font-black uppercase tracking-widest">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 block">Operational Category</label>
                      <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => setValue("category", category, { shouldValidate: true })}
                            className={`px-6 py-4 rounded-[1rem] font-black text-[9px] uppercase tracking-[0.2em] transition-all duration-500 border ${formValues.category === category
                              ? "bg-emerald-500 text-black border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)] scale-105"
                              : "bg-white/[0.03] text-white/40 border-white/[0.05] hover:border-white/20 hover:text-white hover:bg-white/[0.06]"
                              }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 block">Detailed Specifications</label>
                      <div className="rounded-[1.5rem] overflow-hidden border border-white/[0.08] bg-white/[0.01] hover:border-white/20 transition-colors">
                        <Controller
                          name="description"
                          control={control}
                          render={({ field }) => (
                            <ReactQuill
                              {...field}
                              theme="snow"
                              className="bg-transparent text-white custom-quill"
                              placeholder="Define the scope of your operational link..."
                            />
                          )}
                        />
                      </div>
                      {errors.description && <p className="text-red-500/70 text-[10px] mt-2 font-black uppercase tracking-widest">{errors.description.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Impact & Pricing */}
            {currentStep === 2 && (
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-black tracking-tight flex items-center gap-4 text-white">
                    <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">02</span>
                    VISUAL TELEMETRY & VALUE
                  </h3>

                  <div className="space-y-10">
                    <div className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/[0.08] group/upload hover:border-emerald-500/20 transition-all duration-700">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-8 block text-center">Visual Assets Submission</label>
                      <FileUploader
                        name="workMedia"
                        value={formValues.workMedia}
                        onChange={(files: { url: string; type: "image" | "video" }[]) =>
                          setValue("workMedia", files, { shouldValidate: true })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white/[0.03] border border-white/[0.08] p-8 rounded-[1.5rem] group/field transition-all hover:border-emerald-500/20">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                          <DollarSign className="w-4 h-4 text-emerald-500" /> Operational Budget
                        </label>
                        <div className="relative">
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-black text-emerald-500/40">$</span>
                          <input
                            type="number"
                            {...register("price", { valueAsNumber: true })}
                            className="w-full bg-transparent pl-10 py-2 text-4xl font-black outline-none border-b border-white/[0.08] focus:border-emerald-500 transition-all text-white"
                          />
                        </div>
                      </div>

                      <div className="bg-white/[0.03] border border-white/[0.08] p-8 rounded-[1.5rem] group/field transition-all hover:border-emerald-500/20">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-emerald-500" /> Deployment Deadline
                        </label>
                        <div className="flex gap-6">
                          <input
                            type="date"
                            {...register("deliveryDate")}
                            className="bg-transparent text-sm font-black flex-1 outline-none border-b border-white/[0.08] focus:border-emerald-500 transition-all py-2 text-white uppercase"
                          />
                          <input
                            type="time"
                            {...register("deliveryTime")}
                            className="bg-transparent text-sm font-black w-24 outline-none border-b border-white/[0.08] focus:border-emerald-500 transition-all py-2 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Elite Expertise */}
            {currentStep === 3 && (
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-black tracking-tight flex items-center gap-4 text-white">
                    <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">03</span>
                    PROFESSIONAL ARSENAL
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                      <SkillsInput
                        name="skills"
                        label="MODULAR COMPETENCIES"
                        control={control}
                        trigger={trigger}
                        setValue={setValue}
                        errorMessage={errors.skills?.message || ""}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] block ml-1">Rank Seniority</label>
                      <div className="relative">
                        <select
                          {...register("experienceLevel")}
                          className="w-full bg-white/[0.03] border border-white/[0.08] p-5 rounded-[1.25rem] font-black text-xs outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all appearance-none text-emerald-400 uppercase tracking-widest"
                        >
                          <option value="Junior">LEVEL: JUNIOR PRO</option>
                          <option value="Mid">LEVEL: ASSOCIATE EXPERT</option>
                          <option value="Senior">LEVEL: ELITE STRATEGIST</option>
                        </select>
                        <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 pointer-events-none rotate-90" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] block ml-1">Comms Protocol</label>
                      <input
                        type="text"
                        placeholder="E.G. ENGLISH, FRENCH"
                        className="w-full bg-white/[0.03] border border-white/[0.08] p-5 rounded-[1.25rem] font-black text-xs outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-white placeholder:text-white/10"
                        onChange={(e) => setValue("languagesSpoken", e.target.value.split(",").map(l => l.trim()))}
                      />
                    </div>

                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] block ml-1">Operations Portfolio URL</label>
                      <div className="relative">
                        <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40" />
                        <input
                          type="url"
                          {...register("portfolioLink")}
                          placeholder="HTTPS://MANIFESTATION.WORKSPACE"
                          className="w-full bg-white/[0.03] border border-white/[0.08] pl-14 p-5 rounded-[1.25rem] font-black text-xs outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-white placeholder:text-white/10"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-4 pt-4">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] block text-center">Contact Decryption</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                          type="email"
                          {...register("contactInfo.email")}
                          placeholder="SECURE EMAIL"
                          className="bg-white/[0.03] border border-white/[0.08] p-5 rounded-[1.25rem] font-black text-xs outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-white placeholder:text-white/10"
                        />
                        <input
                          type="text"
                          {...register("contactInfo.phone")}
                          placeholder="SIGNAL NUMBER"
                          className="bg-white/[0.03] border border-white/[0.08] p-5 rounded-[1.25rem] font-black text-xs outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-white placeholder:text-white/10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-12 border-t border-white/[0.05]">
              {currentStep > 1 ? (
                <motion.button
                  whileHover={{ x: -5 }}
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-5 font-black uppercase tracking-[0.3em] text-[10px] text-white/20 hover:text-white transition-all flex items-center gap-4"
                >
                  <span className="text-sm opacity-50">←</span> REGRESS PHASE
                </motion.button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleNext}
                  className="px-12 py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-[1.25rem] hover:bg-emerald-400 transition-all duration-500 shadow-2xl flex items-center gap-4 group"
                >
                  ADVANCE PHASE <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-16 py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-[1.25rem] hover:from-emerald-500 hover:to-green-500 transition-all duration-500 shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center gap-4 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? <ClipLoader size={16} color="#000" /> : (
                    <>
                      FINALIZE MANIFESTATION <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </div>

      <style jsx global>{`
        .custom-quill .ql-toolbar {
          background: rgba(255, 255, 255, 0.02);
          border: none !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 1.5rem 1.5rem 0 0;
          padding: 1.5rem !important;
        }
        .custom-quill .ql-container {
          border: none !important;
          min-height: 250px;
          font-family: inherit;
        }
        .custom-quill .ql-editor {
          font-size: 0.9rem;
          color: white;
          padding: 2rem;
          font-weight: 500;
          line-height: 1.6;
        }
        .custom-quill .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.1);
          font-style: normal;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.75rem;
        }
        .custom-quill .ql-stroke {
          stroke: rgba(255, 255, 255, 0.3) !important;
        }
        .custom-quill .ql-stroke:hover {
          stroke: rgba(255, 255, 255, 0.8) !important;
        }
        .custom-quill .ql-fill {
          fill: rgba(255, 255, 255, 0.3) !important;
        }
        .custom-quill .ql-picker {
          color: rgba(255, 255, 255, 0.3) !important;
        }
      `}</style>
    </div>
  );
};

export default Form;
