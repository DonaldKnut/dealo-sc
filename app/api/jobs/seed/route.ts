import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { JobModel } from "@/models/Job";

export const dynamic = "force-dynamic";

// Categories mapping for better categorization
const categoryMap: Record<string, string> = {
  software: "Software Development",
  design: "Design",
  marketing: "Marketing",
  sales: "Sales",
  customer: "Customer Support",
  product: "Product",
  business: "Business",
  data: "Data Science",
  devops: "DevOps",
  finance: "Finance",
  hr: "Human Resources",
  legal: "Legal",
  writing: "Writing",
  other: "Other",
};

// Generate job icon URL based on category
function getJobIcon(category: string): string {
  const icons: Record<string, string> = {
    "Software Development": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop",
    "Design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop",
    "Marketing": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=400&fit=crop",
    "Sales": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop",
    "Customer Support": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=400&fit=crop",
    "Product": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop",
    "Data Science": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop",
    "DevOps": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=400&fit=crop",
    "Finance": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop",
    "Human Resources": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=400&fit=crop",
    "Writing": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop",
  };
  return icons[category] || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop";
}

// Extract skills from description
function extractSkills(description: string, tags: string[]): string[] {
  const commonSkills = [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C++", "C#",
    "HTML", "CSS", "Vue.js", "Angular", "Express", "Django", "Flask", "Spring",
    "SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "Docker", "Kubernetes",
    "AWS", "Azure", "GCP", "Git", "CI/CD", "Agile", "Scrum", "REST API",
    "GraphQL", "Microservices", "Machine Learning", "AI", "Data Analysis",
    "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "UI/UX Design",
    "SEO", "SEM", "Content Marketing", "Social Media", "Email Marketing",
    "Salesforce", "HubSpot", "Analytics", "Google Analytics", "Tableau",
  ];

  const descriptionLower = description.toLowerCase();
  const foundSkills: string[] = [];

  // Check tags first
  tags.forEach(tag => {
    if (tag && !foundSkills.includes(tag)) {
      foundSkills.push(tag);
    }
  });

  // Check description for common skills
  commonSkills.forEach(skill => {
    if (descriptionLower.includes(skill.toLowerCase()) && !foundSkills.includes(skill)) {
      foundSkills.push(skill);
    }
  });

  // Limit to 8 skills max
  return foundSkills.slice(0, 8);
}

// Determine experience level from description
function extractExperience(description: string): number {
  const desc = description.toLowerCase();
  if (desc.includes("senior") || desc.includes("5+") || desc.includes("10+")) return 5;
  if (desc.includes("mid") || desc.includes("3+") || desc.includes("2-5")) return 3;
  if (desc.includes("junior") || desc.includes("entry") || desc.includes("0-2")) return 1;
  return 2; // Default to mid-level
}

// Estimate salary from description or use default
function estimateSalary(category: string, experience: number): number {
  const baseSalaries: Record<string, number> = {
    "Software Development": 80000,
    "Design": 60000,
    "Marketing": 55000,
    "Sales": 50000,
    "Customer Support": 45000,
    "Product": 70000,
    "Data Science": 90000,
    "DevOps": 85000,
    "Finance": 65000,
    "Human Resources": 55000,
    "Writing": 50000,
  };

  const base = baseSalaries[category] || 60000;
  const multiplier = experience >= 5 ? 1.5 : experience >= 3 ? 1.2 : 1.0;
  return Math.round(base * multiplier);
}

export async function POST(request: NextRequest) {
  try {
    // Attempt database connection with timeout
    let connectionSuccess = false;
    try {
      await Promise.race([
        connect(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Connection timeout")), 10000)
        ),
      ]);
      connectionSuccess = true;
    } catch (connectError: any) {
      console.error("Database connection error:", connectError);
      
      // Check for specific error types
      if (connectError.message?.includes("EHOSTUNREACH") || 
          connectError.message?.includes("timeout") ||
          connectError.code === "EHOSTUNREACH") {
        return NextResponse.json(
          {
            success: false,
            message: "Cannot connect to MongoDB. Please check:\n1. Your internet connection\n2. MongoDB Atlas IP whitelist settings\n3. MongoDB connection string in environment variables",
            error: "Database connection failed",
            details: connectError.message,
          },
          { status: 503 }
        );
      }
      
      throw connectError;
    }

    if (!connectionSuccess) {
      throw new Error("Database connection failed");
    }

    const { clear = false } = await request.json().catch(() => ({}));

    // Clear existing jobs if requested
    if (clear) {
      const deleteResult = await JobModel.deleteMany({});
      console.log(`Cleared ${deleteResult.deletedCount} existing jobs`);
    }

    // Fetch jobs from Remotive API
    const categories = [
      "software-dev",
      "design",
      "marketing",
      "sales",
      "customer-support",
      "product",
      "data",
      "devops",
      "finance-legal",
      "hr",
      "writing",
    ];

    let totalJobs = 0;
    const jobsToInsert: any[] = [];

    for (const category of categories) {
      try {
        const response = await fetch(
          `https://remotive.com/api/remote-jobs?category=${category}&limit=10`,
          { cache: "no-store" }
        );

        if (!response.ok) continue;

        const data = await response.json();
        const jobs = data.jobs || [];

        for (const job of jobs) {
          try {
            const categoryName = categoryMap[category.split("-")[0]] || "Other";
            const description = job.description || "";
            const tags = (job.tags || []).map((t: any) => 
              typeof t === "string" ? t : t?.name || ""
            ).filter(Boolean);
            
            const skills = extractSkills(description, tags);
            const experience = extractExperience(description);
            const budget = estimateSalary(categoryName, experience);
            
            // Calculate deadline (30 days from now)
            const deadline = new Date();
            deadline.setDate(deadline.getDate() + 30);

            const jobData = {
              title: job.title || "Untitled Position",
              description: description.substring(0, 5000) || "No description available",
              budget: budget,
              deadline: deadline,
              skillsRequired: skills.length > 0 ? skills : ["Communication", "Teamwork"],
              location: job.candidate_required_location || "Remote",
              experienceRequired: experience,
              isRemote: true,
              remote: true,
              category: categoryName,
              country: job.candidate_required_location?.split(",")[1]?.trim() || "Global",
              city: job.candidate_required_location?.split(",")[0]?.trim() || "Remote",
              type: "full-time",
              jobIcon: getJobIcon(categoryName),
              isFeatured: Math.random() > 0.7, // 30% chance of being featured
              status: "Active",
              companyName: job.company_name || "Company",
            };

            jobsToInsert.push(jobData);
            totalJobs++;
          } catch (err) {
            console.error(`Error processing job ${job.id}:`, err);
          }
        }
      } catch (err) {
        console.error(`Error fetching category ${category}:`, err);
      }
    }

    // Insert jobs in batches
    if (jobsToInsert.length > 0) {
      await JobModel.insertMany(jobsToInsert, { ordered: false });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${totalJobs} jobs`,
      count: totalJobs,
    });
  } catch (error: any) {
    console.error("Error seeding jobs:", error);
    
    // Provide more helpful error messages
    let errorMessage = error.message || "Failed to seed jobs";
    let statusCode = 500;
    
    if (error.message?.includes("EHOSTUNREACH") || error.code === "EHOSTUNREACH") {
      errorMessage = "Cannot reach MongoDB server. Check your network connection and MongoDB Atlas settings.";
      statusCode = 503;
    } else if (error.message?.includes("timeout")) {
      errorMessage = "Database connection timed out. Please try again.";
      statusCode = 504;
    } else if (error.message?.includes("authentication")) {
      errorMessage = "MongoDB authentication failed. Check your connection string credentials.";
      statusCode = 401;
    }
    
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: error.name || "UnknownError",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: statusCode }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST to seed jobs. Add ?clear=true to clear existing jobs first.",
  });
}

