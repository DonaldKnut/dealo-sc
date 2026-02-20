"use client";

import { useState } from "react";

export type UploadPrefix = 
  | "avatars" 
  | "covers" 
  | "marketplace" 
  | "employment" 
  | "courses" 
  | "posts" 
  | "uploads";

interface UseR2UploadOptions {
  prefix?: UploadPrefix;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  url: string | null;
}

/**
 * React hook for uploading files to Cloudflare R2
 */
export function useR2Upload(options: UseR2UploadOptions = {}) {
  const {
    prefix = "uploads",
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    url: null,
  });

  const uploadFile = async (file: File): Promise<string | null> => {
    setState({
      uploading: true,
      progress: 0,
      error: null,
      url: null,
    });

    try {
      // Validate file type
      if (allowedTypes && !allowedTypes.includes(file.type)) {
        throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`);
      }

      // Validate file size
      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
        throw new Error(`File too large. Maximum size is ${maxSizeMB}MB.`);
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("prefix", prefix);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setState((prev) => ({ ...prev, progress }));
        }
      };

      const url = await new Promise<string>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const json = JSON.parse(xhr.responseText);
              if (json.url) {
                resolve(json.url);
              } else {
                reject(new Error("Invalid response from server"));
              }
            } catch (err) {
              reject(new Error("Failed to parse response"));
            }
          } else {
            try {
              const json = JSON.parse(xhr.responseText);
              reject(new Error(json.error || "Upload failed"));
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        };

        xhr.onerror = () => reject(new Error("Network error"));
        xhr.open("POST", "/api/uploads/r2");
        xhr.send(formData);
      });

      setState({
        uploading: false,
        progress: 100,
        error: null,
        url,
      });

      onSuccess?.(url);
      return url;
    } catch (error: any) {
      const errorMessage = error.message || "Upload failed";
      setState({
        uploading: false,
        progress: 0,
        error: errorMessage,
        url: null,
      });
      onError?.(errorMessage);
      return null;
    }
  };

  const uploadMultiple = async (files: File[]): Promise<string[]> => {
    setState({
      uploading: true,
      progress: 0,
      error: null,
      url: null,
    });

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("prefix", prefix);

      const res = await fetch("/api/uploads/r2", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Upload failed");
      }

      const json = await res.json();
      const urls = json.urls || [];

      setState({
        uploading: false,
        progress: 100,
        error: null,
        url: null,
      });

      return urls;
    } catch (error: any) {
      const errorMessage = error.message || "Upload failed";
      setState({
        uploading: false,
        progress: 0,
        error: errorMessage,
        url: null,
      });
      onError?.(errorMessage);
      return [];
    }
  };

  const reset = () => {
    setState({
      uploading: false,
      progress: 0,
      error: null,
      url: null,
    });
  };

  return {
    ...state,
    uploadFile,
    uploadMultiple,
    reset,
  };
}



