"use server";

import nodemailer from "nodemailer";
import ejs from "ejs";
import { promises as fs } from "fs";
import path from "path";

interface ScratchCard {
  pin: string;
  serial: string;
  examType: string;
  phone: string;
  status: string;
  expiryDate: Date;
}

interface SendScratchCardEmailParams {
  email: string;
  customerName: string;
  examType: string;
  cards: ScratchCard[];
  totalAmount: number;
  transactionId: string;
}

export const sendScratchCardEmail = async ({
  email,
  customerName,
  examType,
  cards,
  totalAmount,
  transactionId,
}: SendScratchCardEmailParams): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Define the email template path
    const templatePath = path.join(
      process.cwd(),
      "email-templates",
      "scratch-card-purchase.ejs"
    );

    // Read the EJS template file
    const template = await fs.readFile(templatePath, "utf8");

    // Render the template with dynamic data
    const html = ejs.render(template, {
      customerName,
      examType,
      cards,
      totalAmount,
      transactionId,
      customerEmail: email,
    });

    // Create a Nodemailer transporter using Zoho SMTP
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
      subject: `🎉 Your ${examType} Scratch Cards Are Ready!`,
      html: html,
    });

    console.log("✅ Scratch card email sent to:", email);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending scratch card email:", error);
    return { success: false, error: "Failed to send scratch card email." };
  }
};
