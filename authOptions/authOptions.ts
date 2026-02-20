import CredentialsProvider from "next-auth/providers/credentials";
// import LinkedInProvider from "next-auth/providers/linkedin";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/User";
import { connect } from "../database";
import { signJwtToken } from "../lib/jwt";
import { CartItemModel } from "@/models/CartItem";
import { WishlistItemModel } from "@/models/WishlistItem";
import { Role, Status } from "@/types/role";
import type { NextAuthOptions } from "next-auth";
import type { DefaultUser } from "next-auth";
import type { ObjectId } from "mongoose";
import { JWT } from "next-auth/jwt";
import { validateOAuthConfig, getOAuthProviderConfig } from "@/lib/auth-utils";
import { Types } from "mongoose";

interface ExtendedUser extends Omit<DefaultUser, "name" | "email"> {
  _id: string;
  name: string; // Make name required and non-nullable
  email: string; // Make email required and non-nullable
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
  isEmailVerified?: boolean; // Add email verification status
  provider?: string; // Add provider information
}

interface ExtendedJWT extends JWT {
  user?: ExtendedUser;
  error?: string;
}

// Check OAuth environment variables
const hasGoogleOAuth =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
// const hasLinkedInOAuth =
//   process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET;
const hasLinkedInOAuth = false; // Disabled at user request

// Log OAuth configuration status
console.log("🔐 OAuth Configuration Status:");
console.log(
  `  Google OAuth: ${hasGoogleOAuth ? "✅ Configured" : "❌ Missing credentials"
  }`
);
// console.log(
//   `  LinkedIn OAuth: ${
//     hasLinkedInOAuth ? "✅ Configured" : "❌ Missing credentials"
//   }`
// );

if (!hasGoogleOAuth && !hasLinkedInOAuth) {
  console.warn(
    "⚠️  No OAuth providers configured. Only email/password login will work."
  );
  console.warn(
    "📝 To enable OAuth, add the required environment variables to .env.local"
  );
  console.warn("📖 See OAUTH_SETUP_GUIDE.md for detailed setup instructions");
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        try {
          await connect();
        } catch (dbError) {
          console.error("Critical DB error in authorize:", dbError);
          throw new Error("DatabaseConnectionError");
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password");
        }

        const user = await UserModel.findOne({ email: credentials.email })
          .populate({ path: "cart", model: CartItemModel })
          .populate({ path: "wishlist", model: WishlistItemModel })
          .populate("company")
          .populate("jobSeekerInfo");

        if (!user) {
          throw new Error("No account found with this email");
        }

        if (!user.isEmailVerified) {
          throw new Error("Please verify your email before logging in");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Incorrect password");
        }

        return {
          id: user._id.toString(),
          _id: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          image: typeof user.avatar === "string" ? user.avatar : null,
          role: user.role as Role,
          isAdmin: user.isAdmin,
          accessToken: signJwtToken(
            { id: user._id.toString(), role: user.role },
            { expiresIn: "7d" }
          ),
          avatar: typeof user.avatar === "string" ? user.avatar : null,
          cart: user.cart?.map((item: any) => item._id?.toString()) || [],
          wishlist:
            user.wishlist?.map((item: any) => item._id?.toString()) || [],
          status: user.status as Status,
          credits: user.credits || 0,
          company: user.company ? user.company._id?.toString() : null,
          jobSeekerInfo: user.jobSeekerInfo
            ? user.jobSeekerInfo._id?.toString()
            : null,
          isProfileComplete: user.isProfileComplete || false,
          isEmailVerified: user.isEmailVerified || false,
        };
      },
    }),
    // Only include OAuth providers if credentials are configured
    ...(hasGoogleOAuth
      ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          authorization: {
            params: { scope: "profile email" },
          },
          httpOptions: {
            timeout: 30000, // 30 seconds timeout
          },
          wellKnown:
            "https://accounts.google.com/.well-known/openid-configuration",
          profile(profile) {
            return {
              id: profile.sub,
              name: profile.name,
              email: profile.email,
              image: profile.picture,
            } as any;
          },
        }),
      ]
      : []),
    /* LinkedIn disabled
    ...(hasLinkedInOAuth
      ? [
          LinkedInProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID!,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
            authorization: {
              params: { scope: "openid profile email" },
            },
            profile(profile) {
              console.log("LinkedIn profile received:", profile);
              return {
                id: profile.sub || profile.id,
                name:
                  profile.name ||
                  `${profile.given_name || ""} ${
                    profile.family_name || ""
                  }`.trim(),
                email: profile.email,
                image: profile.picture,
              } as any;
            },
          }),
        ]
      : []),
    */
  ],

  pages: {
    signIn: "/sign-in",
    error: "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === "development",

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours for better security
  },

  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours for better security
  },

  events: {
    async signOut({ token, session }) {
      // Best-effort: update DB status, never block sign-out
      try {
        const userId =
          (token as any)?.user?._id ||
          (token as any)?.user?.id ||
          (session as any)?.user?.id;

        if (!userId || !Types.ObjectId.isValid(String(userId))) return;

        await connect();
        await UserModel.findByIdAndUpdate(String(userId), { status: "OFFLINE" });
      } catch (error) {
        console.error("Optional DB update failed during signOut event:", error);
      }
    },
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback triggered:", {
        provider: account?.provider,
        email: user.email,
        name: user.name,
      });

      // Handle OAuth sign-ins (production: require DB)
      if (account?.provider === "google") {
        try {
          await connect();
        } catch (err) {
          console.error("SignIn DB connect error - Blocking login:", err);
          return "/connection-error";
        }

        const existingUser = await UserModel.findOne({ email: user.email });

        if (!existingUser) {
          // Auto-create OAuth user then let onboarding complete profile handle details
          try {
            const [firstName, ...lastNameParts] = (user.name || "").split(" ");
            const lastName = lastNameParts.join(" ") || "";

            const newUser = new UserModel({
              firstName: firstName || "User",
              lastName: lastName || "User",
              email: user.email,
              avatar: user.image,
              password: await bcrypt.hash(`${user.email}-${Date.now()}`, 10),
              dateOfBirth: new Date(1990, 0, 1),
              isEmailVerified: true,
              role: Role.STUDENT,
              isAdmin: false,
              isTeenAccount: false,
              isCertified: false,
              isVerified: false,
              isProfileComplete: false,
              certificationAttempts: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
              credits: 5,
              status: "ONLINE",
            });

            await newUser.save();
            console.log(
              `Created new user from ${account.provider}: ${user.email}`
            );

            // Fire-and-forget welcome email
            try {
              await fetch(
                `${process.env.NEXTAUTH_URL}/api/send-welcome-email`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    userId: newUser._id,
                    email: user.email,
                    firstName: firstName || "User",
                    lastName: lastName || "User",
                    source: account.provider,
                  }),
                }
              );
            } catch (error) {
              console.error(
                "Failed to send welcome email to OAuth user:",
                error
              );
            }
          } catch (error) {
            console.error(
              `Error creating user from ${account.provider}:`,
              error
            );
            // Allow sign-in to proceed; JWT will fallback minimal session
            return true;
          }
        } else {
          console.log(`Existing user found: ${user.email}`);
        }
      }

      console.log("SignIn callback returning true");
      return true;
    },

    async jwt({ token, user, account }) {
      // On first sign in, user and account are present
      if (user && account) {
        const isOAuth = account.provider === "google";

        if (isOAuth) {
          try {
            await connect();
            const existingUser = await UserModel.findOne({ email: user.email })
              .populate({ path: "cart", model: CartItemModel })
              .populate({ path: "wishlist", model: WishlistItemModel })
              .populate("company")
              .populate("jobSeekerInfo");

            if (existingUser) {
              token.user = {
                id: existingUser._id.toString(),
                _id: existingUser._id.toString(),
                email: existingUser.email,
                name: `${existingUser.firstName} ${existingUser.lastName}`,
                role: existingUser.role as Role,
                isAdmin: existingUser.isAdmin,
                accessToken: signJwtToken(
                  { id: existingUser._id.toString(), role: existingUser.role },
                  { expiresIn: "7d" }
                ),
                avatar: existingUser.avatar || (user as any).image || null,
                cart: existingUser.cart?.map((item: any) => item._id?.toString()) || [],
                wishlist: existingUser.wishlist?.map((item: any) => item._id?.toString()) || [],
                status: existingUser.status as Status,
                credits: existingUser.credits || 0,
                company: existingUser.company ? (existingUser.company as any)._id?.toString() : null,
                jobSeekerInfo: existingUser.jobSeekerInfo ? (existingUser.jobSeekerInfo as any)._id?.toString() : null,
                isProfileComplete: existingUser.isProfileComplete || false,
                isEmailVerified: existingUser.isEmailVerified || false,
                provider: account.provider,
              } as any;
              return token;
            }
          } catch (error) {
            console.error("CRITICAL: Error populating OAuth user in JWT - DB is likely down:", error);
            token.error = "DatabaseConnectionError";
            return token;
          }
        }

        // Fallback for first call (including Credentials)
        token.user = user as ExtendedUser;
        return token;
      }

      // On subsequent calls, if we don't have token.user._id but we have token.user.email, try to recover it
      if (!(token.user as any)?._id && token.email) {
        try {
          await connect();
          const existingUser = await UserModel.findOne({ email: token.email });
          if (existingUser) {
            (token.user as any) = {
              ...(token.user || {}),
              _id: existingUser._id.toString(),
              id: existingUser._id.toString(),
              role: existingUser.role,
              isProfileComplete: existingUser.isProfileComplete,
            };
          }
        } catch (e) {
          console.error("Recovery JWT error:", e);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.user) {
        session.user = {
          ...session.user,
          ...token.user,
        };
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      try {
        const parsed = new URL(url, baseUrl);
        const error = parsed.searchParams.get("error");
        const message = parsed.searchParams.get("message");

        console.log("Redirect callback - URL:", url);
        console.log("Redirect callback - Base URL:", baseUrl);
        console.log("Redirect callback - Pathname:", parsed.pathname);
        console.log("Redirect callback - Error:", error);
        console.log("Redirect callback - Message:", message);

        // Handle signout - always redirect to home and don't process further
        if (
          parsed.pathname === "/api/auth/signout" ||
          url.includes("signout")
        ) {
          console.log("Signout detected, redirecting to home");
          return `${baseUrl}/`;
        }

        // Normalize NoAccount message to toggle sign-up
        if (message === "NoAccount") {
          return `${baseUrl}/sign-in?signup=true&message=NoAccount`;
        }

        // Handle OAuth callback success - send user to intended destination, not sign-in
        if (
          parsed.pathname === "/api/auth/callback/google"
        ) {
          if (error) {
            return `${baseUrl}/sign-in?error=${error}`;
          }
          // Use the URL next-auth intended (e.g. callbackUrl from signIn(provider, { callbackUrl }))
          // so the user lands on /complete-profile or dashboard, not back on sign-in
          const intended =
            url && url.startsWith(baseUrl)
              ? url
              : `${baseUrl}/complete-profile`;
          console.log("OAuth callback successful, redirecting to:", intended);
          return intended;
        }

        // Handle signin page redirects
        if (parsed.pathname === "/api/auth/signin" && !error) {
          // Let the sign-in form handle the redirect based on user status
          return `${baseUrl}/sign-in`;
        }

        // For all other cases, allow the original URL
        return url;
      } catch (error) {
        console.error("Redirect error:", error);
        return baseUrl;
      }
    },
  },
};
