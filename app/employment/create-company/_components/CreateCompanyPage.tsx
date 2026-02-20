"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FaSpinner } from "react-icons/fa";
import FileUpload from "@/components/forms/_components/FileUpload";
import SelectInput from "@/components/forms/_components/SelectInput";
import TextInput from "@/components/forms/_components/TextInput";
import CustomPhoneInput from "@/components/forms/_components/PhoneInput";
import Notification from "@/components/Notification";

const personalEmailDomains = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "mail.com",
  "zoho.com",
];

const companyValidationSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  industry: z.string().min(1, "Industry is required"),
  registrationCertificateNumber: z
    .string()
    .min(1, "Registration Certificate Number is required"),
  contactEmail: z
    .string()
    .email("Invalid email address")
    .refine((email) => {
      const emailDomain = email.split("@")[1]?.toLowerCase();
      return emailDomain && !personalEmailDomains.includes(emailDomain);
    }, "Personal email domains like @gmail.com are not allowed"),
  phoneNumber: z.string().optional(),
  companyDescription: z.string().optional(),
  companyImageUrl: z.string().url("Invalid image URL").optional(),
  companyCertificateUrl: z.string().url("Invalid certificate URL").optional(),
  companyWebsite: z.string().url("Invalid website URL").optional(),
  companyAddress: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyValidationSchema>;

export default function CreateCompanyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companyValidationSchema),
    mode: "onChange",
  });

  const formValues = watch();

  // Log form values, errors, and validity whenever they change
  useEffect(() => {
    console.log("Form Values:", formValues);
    console.log("Validation Errors:", errors);
    console.log("Is Form Valid:", isValid);
  }, [formValues, errors, isValid]);

  const handleFormSubmission = async (formData: CompanyFormValues) => {
    const transformedData = {
      ...formData,
      imageUrl: formData.companyImageUrl, // Map companyImageUrl to imageUrl
    };

    setIsLoading(true);
    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      });
      console.log("Submitted Form Data:", JSON.stringify(transformedData));

      if (response.ok) {
        setNotification({
          message: "Company created successfully!",
          type: "success",
        });
        setTimeout(() => router.push("/employment/new-listing"), 2000);
      } else {
        setNotification({ message: "Failed to create company", type: "error" });
      }
    } catch (error) {
      console.error("Error creating company:", error);
      setNotification({
        message: "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen mt-5">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <form
        onSubmit={handleSubmit(handleFormSubmission)}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center playfair-italic mb-4">
          Create a New Company
        </h2>

        <h3 className="text-[#295b1c]">Upload Company Logo</h3>
        <FileUpload
          name="companyImageUrl"
          label="Upload Company Logo"
          control={control}
          errorMessage={errors.companyImageUrl?.message}
        />

        <TextInput
          name="companyName"
          label="Company Name"
          control={control}
          errorMessage={errors.companyName?.message}
        />

        <TextInput
          name="registrationCertificateNumber"
          label="Registration Certificate Number"
          control={control}
          errorMessage={errors.registrationCertificateNumber?.message}
        />

        <CustomPhoneInput
          name="phoneNumber"
          label="Phone Number"
          control={control}
          errors={errors}
        />

        <SelectInput
          name="industry"
          label="Industry"
          control={control}
          options={[
            { value: "Technology", label: "Technology" },
            { value: "Finance", label: "Finance" },
            { value: "Healthcare", label: "Healthcare" },
          ]}
          errorMessage={errors.industry?.message}
        />

        <h3 className="text-[#295b1c]">Upload Registration Certificate</h3>
        <FileUpload
          name="companyCertificateUrl"
          label="Upload Registration Certificate"
          control={control}
          errorMessage={errors.companyCertificateUrl?.message}
        />

        <TextInput
          name="companyDescription"
          label="Company Description"
          control={control}
          isTextArea
          errorMessage={errors.companyDescription?.message}
        />

        <TextInput
          name="companyWebsite"
          label="Company Website"
          control={control}
          errorMessage={errors.companyWebsite?.message}
        />

        <TextInput
          name="companyAddress"
          label="Company Address"
          control={control}
          errorMessage={errors.companyAddress?.message}
        />

        <TextInput
          name="contactEmail"
          label="Contact Email"
          control={control}
          type="email"
          errorMessage={errors.contactEmail?.message}
        />

        <button
          type="submit"
          className={`w-full flex items-center justify-center bg-[#3c5137] hover:bg-[#476c3d] text-white px-4 py-2 rounded mt-4 ${
            !isValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading || !isValid}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" /> Creating Company...
            </>
          ) : (
            <>
              Create Company
              <FontAwesomeIcon icon={faCheckCircle} className="ml-2" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
