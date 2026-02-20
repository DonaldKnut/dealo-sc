"use server";

import nodemailer from "nodemailer";
import ejs from "ejs";
import { promises as fs } from "fs";
import path from "path";

export const sendSubscriptionEmail = async (
  email: string,
  firstName: string = "Friend"
): Promise<{ success: boolean; error?: string }> => {
  try {
    const templatePath = path.join(
      process.cwd(),
      "email-templates",
      "subscription-success.ejs"
    );
    const template = await fs.readFile(templatePath, "utf8");
    const html = ejs.render(template, { firstName });

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
      subject: "Welcome to Dealo! You’re Subscribed.",
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send subscription email:", error);
    return { success: false, error: "Could not send email." };
  }
};
