"use client";
import React, { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "@radix-ui/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, IconDefinition } from "@fortawesome/free-solid-svg-icons";

// Switched to Cloudflare Images direct-upload flow

export default function ImageUpload({
  name,
  icon,
  defaultValue = "",
}: {
  name: string;
  icon: IconDefinition;
  defaultValue: string;
}) {
  const fileInRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [url, setUrl] = useState(defaultValue);

  async function uploadImageToR2(file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prefix", "employment");
      const res = await fetch("/api/uploads/r2", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      return (json?.url as string) || null;
    } catch (e) {
      console.error("Error uploading image:", e);
      return null;
    }
  }

  async function handleFileChange(ev: ChangeEvent<HTMLInputElement>) {
    const input = ev.target as HTMLInputElement;
    if (input && input.files?.length && input.files.length > 0) {
      setIsUploading(true);
      const file = input.files[0];
      const imageUrl = await uploadImageToR2(file);
      if (imageUrl) {
        setUrl(imageUrl);
        setIsUploading(false);
        setIsImageLoading(true);
      } else {
        setIsUploading(false);
      }
    }
  }

  const imgLoading = isUploading || isImageLoading;

  return (
    <>
      <div className="bg-gray-100 rounded-md size-24 inline-flex items-center content-center justify-center">
        {imgLoading && (
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-gray-400 animate-spin"
          />
        )}
        {!isUploading && url && (
          <Image
            src={url}
            alt={"uploaded image"}
            width={1024}
            height={1024}
            onLoadingComplete={() => setIsImageLoading(false)}
            className="w-auto h-auto max-w-24 max-h-24"
          />
        )}
        {!imgLoading && !url && (
          <FontAwesomeIcon icon={icon} className="text-gray-400" />
        )}
      </div>
      <input type="hidden" value={url} name={name} />
      <div className="mt-2">
        <input
          onChange={handleFileChange}
          ref={fileInRef}
          type="file"
          className="hidden"
        />
        <Button
          type="button"
          onClick={() => fileInRef.current?.click()}
          variant="soft"
        >
          Select file
        </Button>
      </div>
    </>
  );
}
