"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
;
import {
  PenTool,
  Save,
  Eye,
  Upload,
  Tag,
  Calendar,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

const blogSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  content: z.string().min(100, "Content must be at least 100 characters"),
  category: z.string().min(1, "Please select a category"),
  tags: z.array(z.string()).min(1, "Please add at least one tag"),
  featuredImage: z.string().optional(),
});

type BlogFormType = z.infer<typeof blogSchema>;

const CreateBlogPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [currentTag, setCurrentTag] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<BlogFormType>({
    resolver: zodResolver(blogSchema),
  });

  const categories = [
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

  const selectedTags = watch("tags") || [];

  const addTag = () => {
    if (currentTag.trim() && !selectedTags.includes(currentTag.trim())) {
      setValue("tags", [...selectedTags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue("tags", selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const onSubmit = async (data: BlogFormType) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/writers/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create blog post");
      }

      router.push("/writers/dashboard");
    } catch (error) {
      console.error("Error creating blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/writers/dashboard")}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Create New Blog Post</h1>
                <p className="text-gray-400">Share your expertise with the Dealo community</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => setIsPreview(!isPreview)}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-4 h-4" />
                {isPreview ? "Edit" : "Preview"}
              </motion.button>
              <motion.button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Saving..." : "Save Draft"}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-400" />
              Basic Information
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Blog Title *
                </label>
                <input
                  {...register("title")}
                  className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="Enter an engaging title for your blog post..."
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-2">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Excerpt *
                </label>
                <textarea
                  {...register("excerpt")}
                  rows={3}
                  className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 resize-none"
                  placeholder="Write a brief summary of your blog post..."
                />
                {errors.excerpt && (
                  <p className="text-red-400 text-sm mt-2">{errors.excerpt.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    {...register("category")}
                    className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-white transition-all duration-300"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-sm mt-2">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Featured Image
                  </label>
                  <div className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-xl border-dashed hover:border-green-500 transition-colors">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Click to upload or drag and drop</p>
                      <p className="text-gray-500 text-xs">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Tags *
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      className="flex-1 p-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                      placeholder="Add tags..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm flex items-center gap-2"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-400 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {errors.tags && (
                    <p className="text-red-400 text-sm">{errors.tags.message}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-bold text-white mb-6">Blog Content</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Content *
              </label>
              <textarea
                {...register("content")}
                rows={20}
                className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 resize-none font-mono"
                placeholder="Write your blog content here... You can use Markdown formatting."
              />
              {errors.content && (
                <p className="text-red-400 text-sm mt-2">{errors.content.message}</p>
              )}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <button
              type="button"
              onClick={() => router.push("/writers/dashboard")}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center gap-4">
              <motion.button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Publishing..." : "Publish Post"}
              </motion.button>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPage;
