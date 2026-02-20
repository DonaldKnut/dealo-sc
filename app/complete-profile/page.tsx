import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/authOptions/authOptions";
import CompleteProfileClient from "./_components/CompleteProfileClient";

export const dynamic = "force-dynamic";

export default async function CompleteProfilePage() {
  const session = await getServerSession(authOptions);
  const user = (session?.user || null) as any;

  if (!user) {
    redirect("/sign-in");
  }

  if (!user.isEmailVerified) {
    redirect(
      `/verify-email-new?email=${encodeURIComponent(String(user.email || ""))}`
    );
  }

  if (user.isProfileComplete) {
    redirect("/dealoforge/dashboard");
  }

  return <CompleteProfileClient />;
}
