import { getServerSession } from "next-auth/next";
import { authOptions } from "@/authOptions/authOptions";
import { UserModel } from "@/models/User";
import { connect } from "@/database";

export async function checkUserVerification() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { isVerified: false, user: null, message: "No session found" };
    }

    await connect();

    const user = await UserModel.findOne({ email: session.user.email });

    if (!user) {
      return { isVerified: false, user: null, message: "User not found" };
    }

    // Check if user is verified
    if (!user.isEmailVerified) {
      return {
        isVerified: false,
        user,
        message: "Email not verified",
        shouldRedirect: true,
        redirectTo: "/verify-email",
      };
    }

    // Check if account is active
    if (user.status === "UNVERIFIED" || user.status === "SUSPENDED") {
      return {
        isVerified: false,
        user,
        message: "Account not active",
        shouldRedirect: true,
        redirectTo: "/sign-in",
      };
    }

    return { isVerified: true, user, message: "User verified" };
  } catch (error) {
    console.error("Error checking user verification:", error);
    return {
      isVerified: false,
      user: null,
      message: "Error checking verification",
    };
  }
}

export async function requireVerification() {
  const verification = await checkUserVerification();

  if (!verification.isVerified) {
    throw new Error(verification.message);
  }

  return verification.user;
}


