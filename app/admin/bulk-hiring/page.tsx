"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSafeSession } from "@/hooks/use-safe-session";
import BulkHiringAdmin from "@/components/admin/BulkHiringAdmin";

const AdminBulkHiringPage = () => {
  const session = useSafeSession();
  const { data: sessionData, status } = session || {};
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!sessionData?.user) {
      router.push("/sign-in?callbackUrl=/admin/bulk-hiring");
      return;
    }

    // Check if user is admin
    // You may need to adjust this based on your user role system
    const user = sessionData.user as any;
    if (
      user.role === "admin" ||
      user.isAdmin ||
      user.email?.includes("@dealo.africa")
    ) {
      setIsAuthorized(true);
    } else {
      router.push("/");
    }
  }, [sessionData, status, router]);

  if (status === "loading" || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <BulkHiringAdmin />;
};

export default AdminBulkHiringPage;












