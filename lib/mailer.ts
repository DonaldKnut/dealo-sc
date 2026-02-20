import nodemailer from "nodemailer";

// Create a transporter using your email service configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., 'smtp.gmail.com' for Gmail
  port: parseInt(process.env.EMAIL_PORT || "587"), // Port number
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Define the function to send an email
export async function sendMail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  try {
    // Send the email using the transporter
    const info = await transporter.sendMail({
      from:
        process.env.EMAIL_FROM ||
        '"Dealo Group Incorporated" <no-reply@dealogroup.com>', // Sender address
      to, // Recipient address
      subject, // Subject line
      text, // Plain text body
      html, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
}
