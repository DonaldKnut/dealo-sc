"use client";

import React from "react";
import { useSafeSession } from "@/hooks/use-safe-session";
import { useEffect, useState } from "react";
import Spinner from "@/spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import WhyDealoBest from "@/components/jobs/WhyDealoBest";
import DealoAdvantages from "@/components/jobs/DealoAdvantages";

// Modular components
import FormWrapper from "@/app/employment/_components/new-listing/FormWrapper";
import FormHeader from "@/app/employment/_components/new-listing/FormHeader";
import JobFormFields from "@/app/employment/_components/new-listing/JobFormFields";
import FormActions from "@/app/employment/_components/new-listing/FormActions";
import EmailSentSuccess from "@/app/employment/_components/new-listing/EmailSentSuccess";
import HeroSection from "@/app/employment/_components/new-listing/HeroSection";

// Theme configuration - easily change form background here!
import { formTheme } from "@/app/employment/_components/new-listing/formTheme";
// Or use a preset: import { formThemes } from "@/app/employment/_components/new-listing/formTheme";
// const theme = formThemes.dark; // or formThemes.light, formThemes.glass

// Zod validation schemas
import {
  authenticatedJobFormSchema,
  unauthenticatedJobFormSchema,
  type JobFormData,
} from "@/app/employment/_components/new-listing/jobFormSchema";

// Force dynamic rendering for authentication
export const dynamic = "force-dynamic";

interface CompanyFromAPI {
  _id: string;
  name: string;
  industry: string;
  description?: string;
  rcNumber: string;
  certificateUrl?: string;
  website?: string;
  address?: string;
  email: string;
  phoneNumber?: string;
  isVerified: boolean;
  dateOfRegistration: string;
  owner: string;
  imageUrl?: string;
}

// Job Posting Form Component
const JobPostingForm = ({
  isAuthenticated,
  companies,
  sessionUserId,
}: {
  isAuthenticated: boolean;
  companies?: CompanyFromAPI[];
  sessionUserId?: string;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string>("");

  // Use appropriate schema based on authentication status
  const validationSchema = isAuthenticated
    ? authenticatedJobFormSchema
    : unauthenticatedJobFormSchema;

  const methods = useForm<JobFormData>({
    resolver: zodResolver(validationSchema),
    mode: "onChange", // Validate on change for better UX
    defaultValues: {
      title: "",
      description: "",
      budget: 0,
      deadline: "",
      country: "",
      state: "",
      city: "",
      remote: "onsite",
      type: "full-time",
      category: "",
      skillsRequired: [],
      jobIcon: "",
      contactPhone: "",
      contactEmail: "",
      experienceRequired: "",
      companyName: "",
      organizationId: "",
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

  // Watch all form values to get real-time updates
  // Using watch() without arguments watches all fields and returns an object
  // This ensures the button enables reactively as fields are filled
  const formValues = watch();

  // Custom validation: check if all required fields are filled
  // This enables the button as soon as required fields are filled, with lenient validation
  const isFormComplete = React.useMemo(() => {
    try {
      // Get current values from form
      const currentTitle = formValues?.title || "";
      const currentDescription = formValues?.description || "";
      const currentBudget = formValues?.budget;
      const currentDeadline = formValues?.deadline || "";
      const currentContactPhone = formValues?.contactPhone || "";
      const currentCategory = formValues?.category || "";
      const currentContactEmail = formValues?.contactEmail || "";
      const currentCompanyName = formValues?.companyName || "";

      // Check title - very lenient: just needs 2+ characters
      const hasValidTitle = Boolean(currentTitle && String(currentTitle).trim().length >= 2);

      // Check description - very lenient: strip HTML and check for meaningful content (15 chars minimum)
      const descriptionStr = currentDescription ? String(currentDescription) : "";
      const descriptionText = descriptionStr.replace(/<[^>]*>/g, "").trim();
      const hasValidDescription = descriptionText.length >= 15; // More lenient: 15 chars minimum

      // Check budget - just needs to be a positive number
      let hasValidBudget = false;
      const hasBudgetValue =
        currentBudget !== undefined &&
        currentBudget !== null &&
        String(currentBudget).trim() !== "";
      if (hasBudgetValue) {
        const budgetNum = Number(currentBudget);
        hasValidBudget = !isNaN(budgetNum) && isFinite(budgetNum) && budgetNum > 0;
      }

      // Check deadline - just needs to be selected
      const hasValidDeadline = Boolean(currentDeadline && String(currentDeadline).trim().length > 0);

      // Check contact phone - very lenient: at least 6 digits (accommodates various country formats)
      const phoneStr = currentContactPhone ? String(currentContactPhone) : "";
      const phoneDigits = phoneStr.replace(/\D/g, "");
      const hasValidPhone = phoneDigits.length >= 6; // More lenient: 6 digits minimum

      // Check category - just needs to be selected
      const hasValidCategory = Boolean(currentCategory && String(currentCategory).trim().length > 0);

      // Check all required base fields
      const baseFieldsValid =
        hasValidTitle &&
        hasValidDescription &&
        hasValidBudget &&
        hasValidDeadline &&
        hasValidPhone &&
        hasValidCategory;

      // For unauthenticated users, also check email and company name
      if (!isAuthenticated) {
        const emailStr = currentContactEmail ? String(currentContactEmail).trim() : "";
        const hasValidEmail = emailStr.includes("@") && emailStr.length >= 5; // Very lenient: just needs @ and 5+ chars
        const companyNameStr = currentCompanyName ? String(currentCompanyName).trim() : "";
        const hasValidCompanyName = companyNameStr.length >= 2; // Very lenient: just 2+ characters
        return baseFieldsValid && hasValidEmail && hasValidCompanyName;
      }

      return baseFieldsValid;
    } catch (error) {
      console.error("Error in form validation:", error);
      return false;
    }
  }, [formValues, isAuthenticated]);

  async function onSubmit(formData: JobFormData) {
    setIsLoading(true);

    try {
      const payload: JobFormData & { requiresVerification?: boolean } = {
        ...formData,
      };

      // For unauthenticated users, we'll send email verification
      if (!isAuthenticated) {
        payload.contactEmail = formData.contactEmail;
        payload.companyName = formData.companyName;
        payload.requiresVerification = true;
      } else if (selectedCompany) {
        // For authenticated users, use selected company if provided
        payload.organizationId = selectedCompany;
      }

      const response = await fetch("/api/jobs/public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save job");
      }

      const result = await response.json();

      if (result.success && result.job) {
        if (!isAuthenticated && result.requiresVerification) {
          setEmailSent(true);
        } else {
          // Job is created and active, redirect to job listing
          router.push(`/employment/dealojobs/${result.job._id}`);
        }
      } else {
        console.error("Error:", result.error);
        alert(result.message || "An error occurred");
      }
    } catch (error: any) {
      console.error("Error submitting job:", error);
      alert(error.message || "An error occurred while posting the job");
    } finally {
      setIsLoading(false);
    }
  }

  if (emailSent) {
    return <EmailSentSuccess theme={formTheme} />;
  }

  return (
    <FormWrapper methods={methods} theme={formTheme}>
      <FormHeader
        isAuthenticated={isAuthenticated}
        theme={formTheme}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <JobFormFields
          control={control}
          errors={errors}
          setValue={setValue}
          trigger={trigger}
          isAuthenticated={isAuthenticated}
          companies={companies}
          selectedCompany={selectedCompany}
          onCompanyChange={(value) => {
            setSelectedCompany(value);
            setValue("organizationId", value);
          }}
          theme={formTheme}
        />

        <FormActions
          isLoading={isLoading}
          isFormComplete={isFormComplete}
          theme={formTheme}
        />
      </form>
    </FormWrapper>
  );
};

export default function NewListingPage() {
  const { data: sessionData, status: sessionStatus } = useSafeSession();
  const [companies, setCompanies] = useState<CompanyFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      if (sessionStatus === "authenticated") {
        try {
          const response = await fetch("/api/companies");
          if (response.ok) {
            const data = await response.json();
            setCompanies(data.companies || []);
          }
        } catch (err) {
          console.error("Error fetching companies:", err);
        } finally {
          setIsLoading(false);
        }
      } else if (sessionStatus !== "loading") {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, [sessionStatus]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const isAuthenticated =
    sessionStatus === "authenticated" && !!sessionData?.user;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Atmospheric Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-green-500/5 blur-[100px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-emerald-400/5 blur-[80px] rounded-full" />
      </div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.png')] mix-blend-overlay" />

      {/* Hero Section */}
      <HeroSection isAuthenticated={isAuthenticated} />

      {/* Job Posting Form Section */}
      <section className="py-12 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <JobPostingForm
            isAuthenticated={isAuthenticated}
            companies={companies}
            sessionUserId={sessionData?.user?.id}
          />
        </div>
      </section>

      {/* Why Dealo is Best Component */}
      <WhyDealoBest />

      {/* Dealo Advantages Component */}
      <DealoAdvantages />
    </div>
  );
}
