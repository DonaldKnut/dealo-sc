"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { useController, Control, FieldErrors } from "react-hook-form";
import Spinner from "@/spinner";


interface FileUploadProps {
  name: string;
  label?: string;
  placeholder?: string;
  control: Control<any>;
  errorMessage?: string;
  errors?: FieldErrors<any>;
}

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  control,
  label = "Upload Image",
  placeholder = "Upload Image",
  errorMessage,
  errors,
}) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const [imageLoading, setImageLoading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    console.log("File dropped:", acceptedFiles);

    setImageLoading(true);

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("prefix", "uploads");

    try {
      const response = await fetch("/api/uploads/r2", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();
      console.log("Upload successful:", data);
      onChange(data.url); // Store R2 URL in form state
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err.message || "Failed to upload image");
    } finally {
      setImageLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  console.log("File value:", value);

  // Extract error message as a string if available
  const errorMsg =
    error?.message ||
    errorMessage ||
    (typeof errors?.[name]?.message === "string" ? errors[name]?.message : "");

  return (
    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#7bf330cc] rounded-lg bg-gray-50">
      <div {...getRootProps()} className="w-full text-center cursor-pointer">
        <input {...getInputProps()} />
        {imageLoading ? (
          <Spinner />
        ) : value ? (
          <Image
            src={value}
            alt="Uploaded image"
            width={1000}
            height={1000}
            className="max-h-[400px] overflow-hidden object-cover rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Image
              src="/assets/icons/upload.svg"
              width={40}
              height={40}
              alt="Upload"
            />
            <p className="text-green-500">Click to upload or drag and drop</p>
            <p className="text-gray-500 text-sm">
              SVG, PNG, JPG, or GIF (max. 800x400px)
            </p>
          </div>
        )}
      </div>
      {typeof errorMsg === "string" && (
        <p className="text-red-500 mt-2">{errorMsg}</p>
      )}
    </div>
  );
};

export default FileUpload;
