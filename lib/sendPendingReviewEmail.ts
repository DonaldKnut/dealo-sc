"use server";

import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

export const sendPendingReviewEmail = async (
  email: string,
  firstName: string = "Dealorian"
): Promise<{ success: boolean; error?: string }> => {
  try {
    const templatePath = path.join(
      process.cwd(),
      "email-templates",
      "pending-review.ejs"
    );

    const html = await ejs.renderFile(templatePath, { firstName });

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `Dealo <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We’re Reviewing Your Certificate | Dealo",
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send pending review email:", error);
    return { success: false, error: "Could not send review email." };
  }
};
