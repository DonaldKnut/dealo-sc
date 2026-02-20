"use server";

import nodemailer from "nodemailer";
import ejs from "ejs";
import { promises as fs } from "fs";
import path from "path";

interface JobAlertEmailParams {
  email: string;
  firstName: string;
  jobs: Array<{
    title: string;
    company?: string;
    location: string;
    budget?: number;
    type?: string;
    _id: string;
  }>;
  searchCriteria?: string;
}

export const sendJobAlertEmail = async ({
  email,
  firstName,
  jobs,
  searchCriteria,
}: JobAlertEmailParams): Promise<{ success: boolean; error?: string }> => {
  try {
    // Create a simple HTML email template
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #16a34a, #15803d); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .job-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 15px; }
            .job-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
            .job-details { color: #6b7280; font-size: 14px; margin-bottom: 5px; }
            .job-link { display: inline-block; background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 New Jobs Matching Your Criteria!</h1>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>
              <p>We found ${jobs.length} new job${jobs.length > 1 ? "s" : ""} that match your saved search criteria${searchCriteria ? `: <strong>${searchCriteria}</strong>` : ""}.</p>
              
              ${jobs
                .map(
                  (job) => `
                <div class="job-card">
                  <div class="job-title">${job.title}</div>
                  ${job.company ? `<div class="job-details">📍 ${job.company}</div>` : ""}
                  <div class="job-details">📍 ${job.location}</div>
                  ${job.budget ? `<div class="job-details">💰 $${job.budget >= 1000 ? (job.budget / 1000).toFixed(0) + "K" : job.budget}/hr</div>` : ""}
                  ${job.type ? `<div class="job-details">⏰ ${job.type}</div>` : ""}
                  <a href="${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/employment/dealojobs/${job._id}" class="job-link">View Job</a>
                </div>
              `
                )
                .join("")}
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/jobs/search" style="background: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  View All Jobs
                </a>
              </div>
              
              <div class="footer">
                <p>You're receiving this because you have job alerts enabled.</p>
                <p><a href="${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/jobs/alerts" style="color: #16a34a;">Manage your alerts</a></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Configure Nodemailer with Zoho Mail
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Dealo Jobs" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎯 ${jobs.length} New Job${jobs.length > 1 ? "s" : ""} Match Your Search!`,
      html: html,
    });

    console.log("✅ Job alert email sent to:", email);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending job alert email:", error);
    return { success: false, error: "Failed to send job alert email." };
  }
};




