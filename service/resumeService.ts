/**
 * Resume Service - Business logic for resume management
 * Extracted from ResumeManager component
 */

import { api } from "@/lib/api/client";

export interface Resume {
  _id: string;
  personalInfo: any;
  experience: any[];
  education: any[];
  skills: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export class ResumeService {
  /**
   * Fetch all resumes for current user
   */
  static async fetchResumes(): Promise<Resume[]> {
    try {
      const response = await api.get<{ resumes: Resume[] }>("/api/resume/save");
      return response.resumes || [];
    } catch (error) {
      console.error("Error fetching resumes:", error);
      throw error;
    }
  }

  /**
   * Delete a resume
   */
  static async deleteResume(id: string): Promise<void> {
    try {
      await api.delete(`/api/resume/save?id=${id}`);
    } catch (error) {
      console.error("Error deleting resume:", error);
      throw error;
    }
  }

  /**
   * Copy resume link to clipboard
   */
  static async copyResumeLink(id: string): Promise<string> {
    const link = `${window.location.origin}/resume/${id}`;
    await navigator.clipboard.writeText(link);
    return link;
  }

  /**
   * Export resume as PDF
   */
  static async exportResume(id: string): Promise<Blob> {
    try {
      const response = await fetch(`/api/resume/export?id=${id}`);
      if (!response.ok) {
        throw new Error("Failed to export resume");
      }
      return await response.blob();
    } catch (error) {
      console.error("Error exporting resume:", error);
      throw error;
    }
  }
}



