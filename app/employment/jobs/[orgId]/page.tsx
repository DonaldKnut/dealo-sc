"use client";

// Force dynamic rendering for authentication
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useSafeSession } from "@/hooks/use-safe-session";
import mongoose from "mongoose";
import { JobModel } from "@/models/Job"; // Job model for fetching jobs
import { UserModel } from "@/models/User"; // User model for querying the admin user
import Jobs from "../../_components/Jobs"; // Correctly import the Jobs component

type PageProps = {
  params: {
    orgId: string; // This will be the admin's user ID
  };
};

// Custom type to represent User data
type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  jobs: string[]; // Job references (array of ObjectId strings)
  company?: string;
  status: string;
};

export default function CompanyJobsPage(props: PageProps) {
  const session = useSafeSession(); const { data: sessionData, status } = session || {};
  const [jobsDocs, setJobsDocs] = useState<any[]>([]);
  const [orgName, setOrgName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated" && sessionData?.user) {
        try {
          // Ensure MongoDB connection
          if (!mongoose.connection.readyState) {
            await mongoose.connect(process.env.MONGO_URI as string);
          }

          // Fetch the admin (organization) based on the user session
          const user = (await UserModel.findById(
            props.params.orgId
          ).lean()) as UserType | null; // Custom type here

          // Ensure user is an admin and valid
          if (!user || user.role !== "ADMIN") {
            console.error("User is not an admin or not found");
            return;
          }

          // Fetch jobs associated with the admin (acting as the organization)
          const jobs = await JobModel.find({ postedBy: user._id }).lean();

          // If the admin has jobs, display them
          setJobsDocs(jobs);
          setOrgName(`${user.firstName} ${user.lastName}`); // Set the admin's name as the org name
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [status, props.params.orgId, session, sessionData?.user]);

  if (status === "loading") {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center">
        You need to be logged in to view this page.
      </div>
    );
  }

  return (
    <div>
      <div className="container">
        <h1 className="text-xl my-6">{orgName} Jobs</h1>
      </div>
      <Jobs jobs={jobsDocs} header={`Jobs posted by ${orgName}`} />
    </div>
  );
}
