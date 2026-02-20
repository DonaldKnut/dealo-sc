import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../../database/index";
import { UserModel } from "@/models/User";

export const dynamic = "force-dynamic";

// Dummy professionals data
const dummyProfessionals = [
  {
    _id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    role: "FREELANCER",
    isCertified: true,
    isVerified: true,
    isProfileComplete: true,
    experience: "5+ years",
    servicesOffered: ["UI/UX Design", "Web Design", "Branding"],
    serviceArea: "Lagos, Nigeria",
    isAvailable: true,
    rating: 4.9,
    completedProjects: 127,
    hourlyRate: "₦15,000",
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
    bio: "Award-winning UI/UX designer with expertise in creating user-centered digital experiences for startups and enterprises.",
    portfolio: [
      {
        title: "E-commerce App Redesign",
        description: "Increased conversion rate by 40%",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
      },
      {
        title: "Banking Dashboard",
        description: "Modern financial interface design",
        image:
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop",
      },
    ],
  },
  {
    _id: "2",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@example.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    role: "FREELANCER",
    isCertified: true,
    isVerified: true,
    isProfileComplete: true,
    experience: "8+ years",
    servicesOffered: [
      "Full Stack Development",
      "Mobile Development",
      "API Development",
    ],
    serviceArea: "Abuja, Nigeria",
    isAvailable: true,
    rating: 4.8,
    completedProjects: 89,
    hourlyRate: "₦25,000",
    skills: ["React", "Node.js", "Python", "React Native", "AWS", "Docker"],
    bio: "Senior full-stack developer specializing in scalable web applications and mobile development. Expert in modern JavaScript frameworks.",
    portfolio: [
      {
        title: "E-learning Platform",
        description: "Built for 50K+ students",
        image:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop",
      },
      {
        title: "Delivery App",
        description: "Real-time tracking system",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
      },
    ],
  },
  {
    _id: "3",
    firstName: "Aisha",
    lastName: "Okechukwu",
    email: "aisha.okechukwu@example.com",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    role: "FREELANCER",
    isCertified: true,
    isVerified: true,
    isProfileComplete: true,
    experience: "3+ years",
    servicesOffered: ["Content Writing", "Copywriting", "SEO"],
    serviceArea: "Port Harcourt, Nigeria",
    isAvailable: true,
    rating: 4.9,
    completedProjects: 156,
    hourlyRate: "₦8,000",
    skills: [
      "Content Strategy",
      "SEO",
      "Copywriting",
      "Blog Writing",
      "Social Media",
    ],
    bio: "Creative content writer and SEO specialist helping businesses grow their online presence through compelling content.",
    portfolio: [
      {
        title: "Tech Blog Series",
        description: "Increased traffic by 200%",
        image:
          "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop",
      },
      {
        title: "E-commerce Copy",
        description: "Boosted sales by 35%",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
      },
    ],
  },
  {
    _id: "4",
    firstName: "David",
    lastName: "Williams",
    email: "david.williams@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    role: "FREELANCER",
    isCertified: true,
    isVerified: true,
    isProfileComplete: true,
    experience: "6+ years",
    servicesOffered: ["Digital Marketing", "Social Media Management", "PPC"],
    serviceArea: "Kano, Nigeria",
    isAvailable: true,
    rating: 4.7,
    completedProjects: 203,
    hourlyRate: "₦12,000",
    skills: [
      "Google Ads",
      "Facebook Ads",
      "Social Media",
      "Analytics",
      "Email Marketing",
    ],
    bio: "Digital marketing expert helping businesses scale through strategic online marketing campaigns and social media management.",
    portfolio: [
      {
        title: "E-commerce Campaign",
        description: "ROAS of 400%",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
      },
      {
        title: "Brand Awareness",
        description: "Reached 2M+ people",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
      },
    ],
  },
  {
    _id: "5",
    firstName: "Fatima",
    lastName: "Hassan",
    email: "fatima.hassan@example.com",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    role: "FREELANCER",
    isCertified: true,
    isVerified: true,
    isProfileComplete: true,
    experience: "4+ years",
    servicesOffered: ["Graphic Design", "Logo Design", "Brand Identity"],
    serviceArea: "Ibadan, Nigeria",
    isAvailable: true,
    rating: 4.8,
    completedProjects: 94,
    hourlyRate: "₦10,000",
    skills: [
      "Adobe Illustrator",
      "Photoshop",
      "InDesign",
      "Logo Design",
      "Branding",
    ],
    bio: "Creative graphic designer passionate about creating memorable brand identities and visual solutions that drive business growth.",
    portfolio: [
      {
        title: "Restaurant Branding",
        description: "Complete brand identity",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
      },
      {
        title: "Tech Startup Logo",
        description: "Modern and scalable design",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
      },
    ],
  },
];

export const GET = async (req: NextRequest) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const location = searchParams.get("location") || "";

    let filteredProfessionals = [...dummyProfessionals];

    // Filter by search query
    if (query) {
      filteredProfessionals = filteredProfessionals.filter(
        (professional) =>
          professional.firstName.toLowerCase().includes(query.toLowerCase()) ||
          professional.lastName.toLowerCase().includes(query.toLowerCase()) ||
          professional.servicesOffered.some((service) =>
            service.toLowerCase().includes(query.toLowerCase())
          ) ||
          professional.skills.some((skill) =>
            skill.toLowerCase().includes(query.toLowerCase())
          )
      );
    }

    // Filter by category
    if (category) {
      filteredProfessionals = filteredProfessionals.filter((professional) =>
        professional.servicesOffered.some((service) =>
          service.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    // Filter by location
    if (location) {
      filteredProfessionals = filteredProfessionals.filter((professional) =>
        professional.serviceArea.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Return only available professionals
    filteredProfessionals = filteredProfessionals.filter(
      (professional) => professional.isAvailable
    );

    if (filteredProfessionals.length === 0) {
      return NextResponse.json(
        {
          professionals: [],
          message: "No professionals found matching your criteria",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        professionals: filteredProfessionals,
        total: filteredProfessionals.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching professionals:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
};
