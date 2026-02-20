// types/types.ts
import { Types, Document } from "mongoose";
import { ConversationDocument } from "@/models/Conversation";
import { UserDocument } from "@/models/User";
import { IMessage } from "@/models/Message";

// User interface
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Avatar {
  url: string;
}

export interface UserReference {
  _id: Types.ObjectId | string;
  firstName: string;
  lastName: string;
  avatar?: Avatar;
}

// Helper function to strip HTML tags
export const stripHtmlTags = (html: string): string => {
  if (typeof document === "undefined") {
    // Server-side fallback
    return html.replace(/<[^>]*>/g, "");
  }
  const temporaryDivElement = document.createElement("div");
  temporaryDivElement.innerHTML = html;
  return temporaryDivElement.textContent || temporaryDivElement.innerText || "";
};

export interface IWork {
  _id: Types.ObjectId | string;
  creator: Types.ObjectId | UserReference;
  category: string;
  title: string;
  description: string;
  price: number;
  workMedia: { url: string; type: "image" | "video" }[];
  deliveryDate: Date | string;
  deliveryTime: string;
  skills: string[];
  contactInfo: {
    email: string;
    phone: string;
  };
  experienceLevel: "Junior" | "Mid" | "Senior";
  portfolioLink: string;
  languagesSpoken?: string[];
  certifications?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Frontend-compatible Work type
export type Work = Omit<IWork, "_id" | "creator"> & {
  _id: string;
  creator: string | UserReference;
};

// Flutterwave configuration function
export const getFlutterWaveConfig = (
  work: Work,
  userEmail?: string,
  userName?: string
) => {
  const workMedia = work.workMedia || [];
  const firstImage = workMedia.find((media) => media.type === "image");

  return {
    public_key:
      process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY ||
      "FLWPUBK_TEST-6bece0e3411fd39df5a367cd2eea14e7-X",
    tx_ref: `tx-${work._id || Date.now()}`,
    amount: work.price,
    currency: "USD",
    payment_options: "card, mobilemoney, ussd",
    customer: {
      email: userEmail || "user@example.com",
      phone_number: work.contactInfo?.phone || "080xxxxxxxx",
      name: userName || "John Doe",
    },
    customizations: {
      title: work.title,
      description: stripHtmlTags(work.description),
      logo: firstImage?.url || "/DEALO_ICON.png",
    },
  };
};

export type FullMessageType = IMessage & {
  sender: UserDocument;
  seen: UserDocument[];
};

export type FullConversationType = ConversationDocument & {
  users: UserDocument[];
  messages: FullMessageType[];
};
