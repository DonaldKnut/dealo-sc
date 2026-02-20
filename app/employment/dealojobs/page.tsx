"use client";
import React, { useEffect, useState } from "react";
import { PageLoader } from "@/components/ui/Loader";
import { Job } from "@/types";
import JobList from "../_components/JobList";
import Modal from "../_components/Modal"

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
;

export default function AllJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await fetch(`/api/currentUser`);
        const data = await response.json();
        setCurrentUserId(data.id); // Adjust based on your API's response
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    }

    async function fetchJobs() {
      try {
        const response = await fetch(`/api/jobs`);
        const data = await response.json();
        setJobs(data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentUser();
    fetchJobs();
  }, []);

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  if (loading) {
    return <PageLoader text="Loading jobs..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black relative">
      {/* Background Pattern - Matching Footer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5"></div>
      </div>

      {/* Glow Effect - Matching Footer */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 via-transparent to-transparent pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 p-8">
        <JobList
          jobs={jobs}
          currentUserId={currentUserId ?? ""}
          onApply={handleApply}
        />
        {showModal && selectedJob && (
          <Modal onClose={() => setShowModal(false)}>
            <h2 className="text-xl font-bold">Apply for {selectedJob.title}</h2>
          </Modal>
        )}
      </div>
    </div>
  );
}
