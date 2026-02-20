import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/authOptions/authOptions";
import SignInClient from "./_components/SignInClient";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);
  const user = (session?.user || null) as any;

  if (user) {
    redirect(user.isProfileComplete ? "/dealoforge/dashboard" : "/complete-profile");
  }

  return <SignInClient />;
}
