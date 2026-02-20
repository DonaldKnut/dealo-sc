"use server";

import nodemailer from "nodemailer";
import ejs from "ejs";
import { promises as fs } from "fs";
import path from "path";

/**
 * Sends a verification email to the user with a secure token.
 *
 * @param email - The recipient's email address.
 * @param firstName - The recipient's first name.
 * @param lastName - The recipient's last name.
 * @param token - The verification token to be included in the email.
 * @returns A success or error response.
 */
export const sendVerificationEmail = async (
  email: string,
  firstName: string,
  lastName: string,
  verificationCode: string
) => {
  try {
    // Define the email template path
    const templatePath = path.join(
      process.cwd(),
      "email-templates",
      "verification-email.ejs"
    );

    // Read the EJS template file
    const template = await fs.readFile(templatePath, "utf8");

    // Add debugging to see what's being passed
    console.log("Email template data:", {
      firstName,
      lastName,
      verificationCode,
    });

    // Render the template with dynamic data - using verificationCode, not verificationLink
    const html = ejs.render(template, {
      firstName,
      lastName,
      verificationCode, // This matches the template variable
    });

    console.log("Generated HTML preview:", html.substring(0, 500) + "...");

    // Create a Nodemailer transporter using Zoho SMTP (Port 465 SSL works)
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send the email
    await transporter.sendMail({
      from: `"Dealo Talent Network" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - Dealo Talent Network",
      html: html,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send verification email." };
  }
};
