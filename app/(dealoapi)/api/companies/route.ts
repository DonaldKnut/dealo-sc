import { authOptions } from "@/authOptions/authOptions";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; // Server-side session retrieval
import { connect } from "@/database";
import { CompanyModel } from "@/models/Company";

const personalEmailDomains = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "mail.com",
  "zoho.com",
];

function isPersonalEmail(email: string): boolean {
  const emailDomain = email.split("@")[1]?.toLowerCase();
  return emailDomain ? personalEmailDomains.includes(emailDomain) : false;
}

export async function POST(req: Request) {
  await connect();

  const session = await getServerSession(authOptions); // Retrieve the current session with authOptions
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      name,
      rcNumber,
      industry,
      description,
      website,
      address,
      email,
      phoneNumber,
      certificateUrl,
      imageUrl, // Check if imageUrl is received in the request body
    } = await req.json();

    console.log("Received imageUrl:", imageUrl); // Debugging output

    if (!name || !rcNumber || !industry || !email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const isVerified = !isPersonalEmail(email);

    const newCompany = new CompanyModel({
      name,
      rcNumber,
      industry,
      description,
      website,
      address,
      email,
      phoneNumber,
      certificateUrl,
      isVerified,
      imageUrl, // Ensure imageUrl is passed here
      dateOfRegistration: new Date(),
      owner: session.user.id,
    });

    await newCompany.save();

    return NextResponse.json(
      { message: "Company created successfully", company: newCompany },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { message: "Failed to create company" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connect();

  try {
    // Fetch all companies instead of filtering by owner
    const companies = await CompanyModel.find({});
    return NextResponse.json({ companies }, { status: 200 });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { message: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
