import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { SubscriberModel } from "@/models/Subscriber";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const {
    email,
    firstName,
    lastName,
    source = "footer",
    tags = [],
    preferences = {
      marketing: true,
      updates: true,
      promotions: true,
      newsletter: true,
    },
  } = body;

  if (typeof email !== "string" || !validateEmail(email)) {
    return NextResponse.json(
      { message: "Invalid email address" },
      { status: 400 }
    );
  }

  try {
    await connect();

    // Check if subscriber already exists
    const existingSubscriber = await SubscriberModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { message: "You're already subscribed to our newsletter!" },
          { status: 409 }
        );
      } else {
        // Reactivate inactive subscriber
        existingSubscriber.isActive = true;
        existingSubscriber.source = source;
        existingSubscriber.tags = Array.from(
          new Set([...existingSubscriber.tags, ...tags])
        );
        existingSubscriber.preferences = {
          ...existingSubscriber.preferences,
          ...preferences,
        };
        await existingSubscriber.save();
      }
    } else {
      // Create new subscriber
      const subscriber = new SubscriberModel({
        email: email.toLowerCase(),
        firstName,
        lastName,
        source,
        tags,
        preferences,
        metadata: {
          userAgent: req.headers.get("user-agent"),
          ipAddress:
            req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
          referrer: req.headers.get("referer"),
        },
      });
      await subscriber.save();
    }

    // Load the email template
    const templatePath = path.resolve(
      "email-templates",
      "subscription-success.ejs"
    );
    const html = await ejs.renderFile(templatePath, {
      email,
      firstName: firstName || "there",
      logoUrl:
        "https://res.cloudinary.com/dtujpq8po/image/upload/v1720111312/serwo4nb3uieilurt2eh.png",
    });

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send the welcome email
    await transporter.sendMail({
      from: `"Dealo Talent Network" <${
        process.env.EMAIL_FROM ?? "no-reply@dealonetwork.com"
      }>`,
      to: email,
      subject: "🎉 Welcome to Dealo Talent Network!",
      html,
    });

    // Update last email sent timestamp
    await SubscriberModel.findOneAndUpdate(
      { email: email.toLowerCase() },
      { lastEmailSent: new Date() }
    );

    return NextResponse.json({
      message: "Subscription successful",
      subscriber: {
        email,
        source,
        subscribedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { message: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
};

export const GET = () => {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
};
