"use server";

import nodemailer from "nodemailer";
import ejs from "ejs";
import { promises as fs } from "fs";
import path from "path";

/**
 * Sends a welcome email after the user has successfully verified their email.
 *
 * @param email - The recipient's email address.
 * @param firstName - The recipient's first name.
 * @returns A success or error response.
 */
export const sendWelcomeEmail = async (email: string, firstName: string) => {
  try {
    // Define the email template path
    const templatePath = path.join(
      process.cwd(),
      "email-templates",
      "welcome-email.ejs"
    );

    // Read and compile the EJS template
    const template = await fs.readFile(templatePath, "utf8");
    const html = ejs.render(template, { firstName });

    // Configure Nodemailer with Zoho Mail
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true, // Use true for port 465
      auth: {
        user: process.env.EMAIL_USER, // e.g., hello@dealonetwork.com
        pass: process.env.EMAIL_PASS, // Your Zoho app-specific password
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Dealo Talent Network" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome to Dealo Talent Network!",
      html: html,
    });

    console.log("✅ Welcome email sent to:", email);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
    return { success: false, error: "Failed to send welcome email." };
  }
};
