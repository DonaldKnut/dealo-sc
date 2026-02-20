import mongoose from "mongoose";
import { AdapterUser } from "next-auth/adapters";
import { Role, Status } from "@/types/role";

export type CustomUser = AdapterUser & {
  _id: string;
  accessToken: string;
  role: Role;
  isAdmin: boolean;
  avatar?: { id: string; url: string } | null;
  cart: string[];
  wishlist: string[];
  status: Status;
  credits: number;
  company?: string | null;
  jobSeekerInfo?: string | null;
};
