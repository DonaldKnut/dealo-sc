import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      _id: string;
      name: string;
      email: string;
      image?: string | null;
      role: string;
      isAdmin: boolean;
      accessToken: string;
      avatar?: string | null;
      wishlist: string[];
      cart: string[];
      status: string;
      credits: number;
      company?: string | null;
      jobSeekerInfo?: string | null;
      isProfileComplete?: boolean;
      isEmailVerified?: boolean;
      provider?: string; // Add provider information
    };
  }

  interface User {
    id: string;
    _id: string;
    name: string;
    email: string;
    image?: string | null;
    role: string;
    isAdmin: boolean;
    accessToken: string;
    avatar?: string | null;
    wishlist: string[];
    cart: string[];
    status: string;
    credits: number;
    company?: string | null;
    jobSeekerInfo?: string | null;
    isProfileComplete?: boolean;
    isEmailVerified?: boolean;
    provider?: string; // Add provider information
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      _id: string;
      name: string;
      email: string;
      image?: string | null;
      role: string;
      isAdmin: boolean;
      accessToken: string;
      avatar?: string | null;
      wishlist: string[];
      cart: string[];
      status: string;
      credits: number;
      company?: string | null;
      jobSeekerInfo?: string | null;
      isProfileComplete?: boolean;
      isEmailVerified?: boolean;
      provider?: string; // Add provider information
    };
  }
}
