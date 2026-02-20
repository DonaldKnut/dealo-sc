import { DefaultSession, DefaultUser } from "next-auth";
import { Role, Status } from "./models/User";

declare module "next-auth" {
  interface User extends DefaultUser {
    _id: string;
    role: Role;
    isAdmin: boolean;
    accessToken: string;
    avatar?: string | null;
    wishlist: string[];
    cart: string[];
    status: Status;
    credits: number;
    company?: string | null;
    jobSeekerInfo?: string | null;
    isProfileComplete?: boolean;
    isEmailVerified?: boolean;
    provider?: string;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}
