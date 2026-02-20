import { useState, useEffect, useCallback } from "react";
import { ResumeService, Resume } from "@/service/resumeService";
import { useApi } from "./useApi";

interface UseResumesReturn {
  resumes: Resume[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
  copyResumeLink: (id: string) => Promise<string>;
  exportResume: (id: string) => Promise<Blob>;
}

/**
 * Hook for managing resumes
 * Extracted from ResumeManager component logic
 */
export function useResumes(): UseResumesReturn {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const { loading, error, execute } = useApi<Resume[]>(
    () => ResumeService.fetchResumes(),
    {
      onSuccess: (data) => {
        if (data) setResumes(data);
      },
    }
  );

  useEffect(() => {
    execute();
  }, [execute]);

  const refetch = useCallback(async () => {
    await execute();
  }, [execute]);

  const deleteResume = useCallback(
    async (id: string) => {
      try {
        await ResumeService.deleteResume(id);
        setResumes((prev) => prev.filter((resume) => resume._id !== id));
      } catch (err) {
        console.error("Error deleting resume:", err);
        throw err;
      }
    },
    []
  );

  const copyResumeLink = useCallback(async (id: string): Promise<string> => {
    try {
      return await ResumeService.copyResumeLink(id);
    } catch (err) {
      console.error("Error copying resume link:", err);
      throw err;
    }
  }, []);

  const exportResume = useCallback(
    async (id: string): Promise<Blob> => {
      try {
        return await ResumeService.exportResume(id);
      } catch (err) {
        console.error("Error exporting resume:", err);
        throw err;
      }
    },
    []
  );

  return {
    resumes,
    loading,
    error,
    refetch,
    deleteResume,
    copyResumeLink,
    exportResume,
  };
}



