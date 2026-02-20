"use client";

// Force dynamic rendering for authentication
export const dynamic = "force-dynamic";
import JobForm from "@/app/employment/_components/JobForm";
import { JobModel } from "@/models/Job";
import { UserModel } from "@/models/User"; // Assuming user model handles roles and org duties
import { useSafeSession } from "@/hooks/use-safe-session";
import mongoose from "mongoose";
import { useEffect, useState } from "react";

type PageProps = {
  params: {
    jobId: string;
  };
};

export default function EditJobPage(pageProps: PageProps) {
  const session = useSafeSession(); const { data: sessionData, status } = session || {};
  const [jobDoc, setJobDoc] = useState<any>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Ensure MongoDB connection
      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGO_URI as string);
      }

      const jobId = pageProps.params.jobId;
      const job = await JobModel.findById(jobId).lean(); // Use lean for better performance

      if (!job) {
        setLoading(false);
        setAccessDenied(true);
        return;
      }

      if (status === "authenticated") {
        const user = await UserModel.findOne({ email: sessionData?.user?.email });

        // Check if the user is an ADMIN or has permission to edit the job
        if (user?.role === "ADMIN" || user?.jobs.includes(jobId)) {
          setJobDoc(job);
        } else {
          setAccessDenied(true);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [status, pageProps.params.jobId, session, sessionData?.user, sessionData?.user?.email]);

  if (loading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center">
        You need to login to view this page.
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex justify-center items-center">Access denied</div>
    );
  }

  return (
    <div>
      {jobDoc && <JobForm organizationId={jobDoc.orgId} jobDocument={jobDoc} />}
    </div>
  );
}
