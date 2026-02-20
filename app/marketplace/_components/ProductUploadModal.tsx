"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  DollarSign,
  Clock,
  User,
  Briefcase,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSafeSession } from "@/hooks/use-safe-session";

interface MediaItem {
  file: File;
  url: string;
  type: "image" | "video";
}

interface ProductUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductUploadModal: React.FC<ProductUploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    deliveryTime: "",
    experienceLevel: "Mid",
    skills: "",
    portfolioLink: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { data: session } = useSafeSession();

  const categories = [
    "Web Development",
    "Mobile Development",
    "Design",
    "Writing",
    "Marketing",
    "Video Editing",
    "Photography",
    "Data Science",
    "AI/ML",
  ];

  const experienceLevels = ["Junior", "Mid", "Senior"];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const url = URL.createObjectURL(file);
        const type = file.type.startsWith("image/") ? "image" : "video";

        setMediaItems((prev) => [...prev, { file, url, type }]);
      }
    });
  };

  const removeMediaItem = (index: number) => {
    setMediaItems((prev) => {
      const newItems = [...prev];
      URL.revokeObjectURL(newItems[index].url);
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setUploading(true);
    try {
      // Upload media files first
      const mediaUrls = await Promise.all(
        mediaItems.map(async (item) => {
          const formData = new FormData();
          formData.append("file", item.file);

          const response = await fetch("/api/upload/media", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error("Upload failed");
          const data = await response.json();
          return { url: data.url, type: item.type };
        })
      );

      // Create work entry
      const workData = {
        ...formData,
        price: parseFloat(formData.price),
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        workMedia: mediaUrls,
        deliveryDate: new Date(
          Date.now() + parseInt(formData.deliveryTime) * 24 * 60 * 60 * 1000
        ),
        contactInfo: {
          email: formData.contactEmail,
          phone: formData.contactPhone,
        },
      };

      const response = await fetch("/api/work/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workData),
      });

      if (response.ok) {
        router.push("/marketplace");
        onClose();
      } else {
        throw new Error("Failed to create work");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload product. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.description && formData.category;
      case 2:
        return formData.price && formData.deliveryTime && formData.skills;
      case 3:
        return (
          mediaItems.length > 0 &&
          formData.contactEmail &&
          formData.contactPhone
        );
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-3xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Create New Service
              </h2>
              <p className="text-gray-400">Step {currentStep} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-gray-400"
                      }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 ${step < currentStep ? "bg-green-600" : "bg-gray-700"
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]"
          >
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-white font-medium mb-2">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Professional Website Design"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your service in detail..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Step 2: Pricing & Details */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Price (USD) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Delivery Time (Days) *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleInputChange}
                        placeholder="7"
                        min="1"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Experience Level *
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Skills (comma-separated) *
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="React, Node.js, MongoDB, AWS"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Portfolio Link
                  </label>
                  <input
                    type="url"
                    name="portfolioLink"
                    value={formData.portfolioLink}
                    onChange={handleInputChange}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Media & Contact */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-white font-medium mb-2">
                    Portfolio Media *
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-green-400 transition-colors"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-white mb-2">
                      Click to upload images or videos
                    </p>
                    <p className="text-gray-400 text-sm">
                      PNG, JPG, MP4, MOV up to 10MB each
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                </div>

                {/* Media Preview */}
                {mediaItems.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mediaItems.map((item, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-xl overflow-hidden bg-gray-800">
                          {item.type === "image" ? (
                            <Image
                              src={item.url}
                              alt={`Preview ${index + 1}`}
                              width={300}
                              height={300}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={item.url}
                              className="w-full h-full object-cover"
                              muted
                            />
                          )}
                        </div>
                        <button
                          onClick={() => removeMediaItem(index)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-white/10 mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-white/10 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={uploading || !isStepValid(currentStep)}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Service
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductUploadModal;
