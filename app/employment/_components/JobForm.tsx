"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { Job } from "@/models/Job";
import SelectInput from "@/components/forms/_components/SelectInput";
import TextInput from "@/components/forms/_components/TextInput";
import CustomPhoneInput from "@/components/forms/_components/PhoneInput";
import FileUpload from "@/components/forms/_components/FileUpload";
import { useRouter } from "next/navigation";
import LocationSelect from "./LocationSelect";
import { ClipLoader } from "react-spinners";
import SkillsInput from "@/components/forms/_components/SkillsInput";
import { ArrowRight } from "lucide-react";
import "react-quill/dist/quill.snow.css";

// Dynamically import React Quill for client-side rendering
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface JobFormProps {
  organizationId: string;
  jobDocument?: Job;
}

export default function JobForm({ organizationId, jobDocument }: JobFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const methods = useForm({
    defaultValues: {
      title: jobDocument?.title || "",
      description: jobDocument?.description || "",
      budget: jobDocument?.budget || 0,
      deadline: jobDocument?.deadline || "",
      country: jobDocument?.country || "",
      state: jobDocument?.location || "",
      city: jobDocument?.city || "",
      remote: jobDocument?.remote ? "remote" : "onsite",
      type: jobDocument?.type || "full-time",
      category: jobDocument?.category || "",
      skillsRequired: jobDocument?.skillsRequired || [],
      jobIcon: jobDocument?.jobIcon || "",
      contactPhone: jobDocument?.contactPhone || "",
      contactPhoto: jobDocument?.contactPhoto || "",
      experienceRequired: jobDocument?.experienceRequired || "",
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = methods;

  const requiredFields = watch([
    "title",
    "description",
    "budget",
    "deadline",
    "contactPhone",
  ]);

  const isFormComplete = requiredFields.every((field) => field && field !== "");

  async function onSubmit(formData: any) {
    setIsLoading(true); // Set loading state to true
    formData.organizationId = organizationId;

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save job");
      }

      const result = await response.json();

      if (result.success) {
        router.push(`/employment/dealojobs/${result.job._id}`);
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error submitting job:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Job</h1>
            <p className="text-gray-600">Fill in the details to create your job listing</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Job Title */}
            <div>
              <TextInput
                name="title"
                label="Job Title *"
                control={control}
                errorMessage={errors.title?.message}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            {/* Category */}
            <div>
              <SelectInput
                name="category"
                label="Job Category *"
                control={control}
                options={[
                  { value: "Business Development", label: "Business Development" },
                  { value: "Construction", label: "Construction" },
                  { value: "Customer Service", label: "Customer Service" },
                  { value: "Finance", label: "Finance" },
                  { value: "Healthcare", label: "Healthcare" },
                  { value: "Human Resources", label: "Human Resources" },
                  { value: "Software Engineering", label: "Software Engineering" },
                  { value: "Marketing", label: "Marketing" },
                  { value: "Design", label: "Design" },
                  { value: "Sales", label: "Sales" },
                ]}
                errorMessage={errors.category?.message}
              />
            </div>

            {/* Job Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Job Description *
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div className="border border-gray-300 rounded-lg">
                    <ReactQuill
                      theme="snow"
                      value={value}
                      onChange={onChange}
                      className="bg-white"
                      placeholder="Describe the role, responsibilities, and requirements..."
                    />
                  </div>
                )}
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
            {/* Skills and Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkillsInput
                name="skillsRequired"
                label="Skills Required"
                control={control}
                setValue={setValue}
                trigger={trigger}
                errorMessage={errors.skillsRequired?.message}
              />
              <TextInput
                name="experienceRequired"
                label="Experience Required (years)"
                control={control}
                type="number"
                placeholder="e.g., 3"
                errorMessage={errors.experienceRequired?.message}
              />
            </div>

            {/* Budget and Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                name="budget"
                label="Salary/Budget (USD) *"
                control={control}
                type="number"
                placeholder="e.g., 50000"
                errorMessage={errors.budget?.message}
              />
              <TextInput
                name="deadline"
                label="Application Deadline *"
                control={control}
                type="date"
                errorMessage={errors.deadline?.message}
              />
            </div>

            {/* Remote Option and Job Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectInput
                name="remote"
                label="Work Location *"
                control={control}
                options={[
                  { value: "onsite", label: "On-site" },
                  { value: "hybrid", label: "Hybrid" },
                  { value: "remote", label: "Remote" },
                ]}
                errorMessage={errors.remote?.message}
              />
              <SelectInput
                name="type"
                label="Job Type *"
                control={control}
                options={[
                  { value: "full-time", label: "Full-time" },
                  { value: "part-time", label: "Part-time" },
                  { value: "contract", label: "Contract" },
                  { value: "internship", label: "Internship" },
                  { value: "temporary", label: "Temporary" },
                ]}
                errorMessage={errors.type?.message}
              />
            </div>

            {/* Location Selector */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
              <LocationSelect control={control} />
            </div>

            {/* Job Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Job Media (Optional)</h3>
              <FileUpload
                name="jobIcon"
                label="Job Icon/Logo"
                control={control}
                errorMessage={errors.jobIcon?.message}
              />
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomPhoneInput
                  name="contactPhone"
                  label="Contact Phone *"
                  control={control}
                  errors={errors}
                />
              </div>
              <FileUpload
                name="contactPhoto"
                label="Company/Contact Photo (Optional)"
                control={control}
                errorMessage={errors.contactPhoto?.message}
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg ${
                  !isFormComplete || isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading || !isFormComplete}
              >
                {isLoading ? (
                  <>
                    <ClipLoader size={20} color="#ffffff" />
                    <span>Publishing Job...</span>
                  </>
                ) : (
                  <>
                    <span>Publish Job</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}
