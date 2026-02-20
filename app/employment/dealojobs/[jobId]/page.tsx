"use client";

import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Job } from "@/types";
import JobList from "../../_components/JobList";
import Modal from "../../_components/Modal"

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
;

export default function AllJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    // Fetch the current user ID or retrieve it from a global state/auth context
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/current-user"); // Replace with your endpoint
        const data = await response.json();
        setCurrentUserId(data.userId);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
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
    fetchJobs();
  }, []);

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader size={50} color="#38a169" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <JobList
        jobs={jobs}
        currentUserId={currentUserId}
        onApply={handleApply}
      />
      {showModal && selectedJob && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 className="text-xl font-bold">Apply for {selectedJob.title}</h2>
        </Modal>
      )}
    </div>
  );
}
