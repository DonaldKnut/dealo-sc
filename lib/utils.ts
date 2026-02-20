import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { CloudflareStreamData } from "@/models/CloudflareStreamData";
import { Types } from "mongoose";

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Check if CloudflareStreamData is populated (not just ObjectId)
 */
export function isCloudflareStreamDataPopulated(
  streamData: CloudflareStreamData | Types.ObjectId | undefined
): streamData is CloudflareStreamData {
  return streamData != null && !(streamData instanceof Types.ObjectId);
}

/**
 * Deep clone an object using JSON parse/stringify
 */
export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

/**
 * Convert File to object URL
 */
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

/**
 * Remove special characters from string
 */
export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\w\s]/gi, "");
};

/**
 * Format amount as currency
 */
export function formatAmount(amount: number, currency: string = "USD"): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
}

/**
 * Form URL query parameters
 */
interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

/**
 * Extract customer ID from URL
 */
export function extractCustomerIdFromUrl(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1];
}

/**
 * Simple ID encryption/decryption (base64)
 */
export function encryptId(id: string): string {
  return btoa(id);
}

export function decryptId(id: string): string {
  return atob(id);
}

/**
 * Get transaction status based on date
 */
export const getTransactionStatus = (date: Date): "Processing" | "Success" => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);
  return date > twoDaysAgo ? "Processing" : "Success";
};

// FORMAT DATE TIME
export const formatDateTime = (
  dateString: Date | string,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    year: "numeric", // numeric year (e.g., '2023')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false),
    timeZone: timeZone, // use the provided timezone
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
    timeZone: timeZone, // use the provided timezone
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
    timeZone: timeZone, // use the provided timezone
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    timeZone: timeZone, // use the provided timezone
  };

  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString("en-US", dateOptions);
  const formattedDay = date.toLocaleDateString("en-US", dateDayOptions);
  const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

  return {
    formattedDateTime: `${formattedDate} ${formattedTime}`,
    formattedDate: formattedDate,
    formattedDayTime: `${formattedDay} ${formattedTime}`,
  };
};

export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};

export const resizeBase64Img = (
  base64Str: any,
  maxWidth = 100,
  maxHeight = 100
) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d") as any;
      ctx.drawImage(img, 0, 0, width, height);

      const newBase64Str = canvas.toDataURL("image/jpeg", 0.7);
      resolve(newBase64Str);
    };
  });
};
