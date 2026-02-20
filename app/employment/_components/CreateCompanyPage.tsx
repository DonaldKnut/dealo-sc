"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FaSpinner } from "react-icons/fa";
import Spinner from "@/spinner";
import SelectInput from "@/components/forms/_components/SelectInput";
import TextInput from "@/components/forms/_components/TextInput";
import FileUpload from "@/components/forms/_components/FileUpload";
import CustomPhoneInput from "@/components/forms/_components/PhoneInput";

// Define a default image URL
const DEFAULT_IMAGE_URL = "/DEALO_ICON.png";

export default function CreateCompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      rcNumber: "",
      industry: "",
      description: "",
      website: "",
      address: "",
      email: "",
      phone: "",
      certificateUrl: "", // File URL from FileUpload
      imageUrl: "", // New field for company image
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Set default image if no image is uploaded
      if (!data.imageUrl) {
        data.imageUrl = DEFAULT_IMAGE_URL;
      }

      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/employment/new-listing");
      } else {
        alert("Failed to create company");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-center mb-4">
          Create a New Company
        </h2>
        <TextInput
          name="name"
          label="Company Name"
          control={control}
          errorMessage={errors.name?.message}
        />
        <TextInput
          name="rcNumber"
          label="RC Number"
          control={control}
          errorMessage={errors.rcNumber?.message}
        />
        <CustomPhoneInput
          name="phone"
          label="Phone Number"
          control={control}
          errors={errors}
        />
        <SelectInput
          name="industry"
          label="Industry"
          control={control}
          options={[
            { value: "Tech", label: "Tech" },
            { value: "Finance", label: "Finance" },
            { value: "Healthcare", label: "Healthcare" },
          ]}
          errorMessage={errors.industry?.message}
        />
        <FileUpload
          name="certificateUrl"
          label="Upload Company Certificate"
          control={control}
          errorMessage={errors.certificateUrl?.message}
        />
        <FileUpload
          name="imageUrl" // New field for company image
          label="Upload Company Image"
          control={control}
          errorMessage={errors.imageUrl?.message}
        />
        <TextInput
          name="description"
          label="Description"
          control={control}
          isTextArea
          errorMessage={errors.description?.message}
        />
        <TextInput
          name="website"
          label="Company Website"
          control={control}
          errorMessage={errors.website?.message}
        />
        <TextInput
          name="address"
          label="Address"
          control={control}
          errorMessage={errors.address?.message}
        />
        <TextInput
          name="email"
          label="Contact Email"
          control={control}
          type="email"
          errorMessage={errors.email?.message}
        />
        <button
          type="submit"
          className="w-full flex items-center justify-center bg-[#3c5137] hover:bg-[#476c3d] text-white px-4 py-2 rounded mt-4"
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Creating Company...
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
