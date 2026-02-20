import TimeAgo from "./TimeAgo";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

// Define the Job type for frontend use
interface Job {
  _id: string;
  title: string;
  description: string;
  budget?: number;
  deadline?: string;
  postedBy?: string;
  country: string;
  remote: boolean;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  jobIcon?: string;
  skillsRequired?: string[];
  location?: string;
  experienceRequired?: string | number;
  applications?: string[]; // Add this field if needed in JobRow
}

export default function JobRow({ jobDoc }: { jobDoc: Job }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm relative">
      {/* Favorite Icon */}
      <div className="absolute cursor-pointer top-4 right-4">
        <FontAwesomeIcon className="size-4 text-gray-300" icon={faHeart} />
      </div>

      {/* Job Details */}
      <div className="flex grow gap-4">
        {/* Job Icon */}
        <div className="content-center w-12 basis-12 shrink-0">
          <Image
            className="size-12"
            src={jobDoc.jobIcon || "/default-icon.png"}
            alt="Job Icon"
            width={48}
            height={48}
          />
        </div>

        {/* Job Information */}
        <div className="grow sm:flex">
          <div className="grow">
            <div>
              <Link
                href={`/jobs/${jobDoc._id}`}
                className="hover:underline text-gray-500 text-sm"
              >
                {jobDoc.country || "?"}
              </Link>
            </div>
            <div className="font-bold text-lg mb-1">
              <Link
                className="hover:underline"
                href={`/employment/show/${jobDoc._id}`}
              >
                {jobDoc.title}
              </Link>
            </div>
            <div className="text-gray-400 text-sm capitalize">
              {jobDoc.remote ? "Remote" : "On-site"} &middot;{" "}
              {jobDoc.country || "N/A"} &middot; {jobDoc.type}-time
              {jobDoc.postedBy && (
                <>
                  {" "}
                  &middot; <Link href={`/jobs/edit/${jobDoc._id}`}>
                    Edit
                  </Link>{" "}
                  &middot;{" "}
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) {
                        return;
                      }
                      try {
                        const response = await axios.delete(`/api/jobs?id=${jobDoc._id}`);
                        if (response.data.success) {
                          alert("Job deleted successfully!");
                          window.location.reload();
                        } else {
                          alert(response.data.message || "Failed to delete job");
                        }
                      } catch (error: any) {
                        console.error("Error deleting job:", error);
                        alert(error.response?.data?.message || "Failed to delete job. Please try again.");
                      }
                    }}
                    className="text-red-600 hover:text-red-800 hover:underline"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
          {jobDoc.createdAt && (
            <div className="content-end text-gray-500 text-sm">
              <TimeAgo createdAt={new Date(jobDoc.createdAt)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
