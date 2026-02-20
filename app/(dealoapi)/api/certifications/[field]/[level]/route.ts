import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";

export async function GET(
  request: NextRequest,
  { params }: { params: { field: string; level: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { field, level } = params;

    // Validate field and level
    const validFields = [
      "programming",
      "design",
      "marketing",
      "business",
      "data-science",
      "cybersecurity",
    ];
    const validLevels = ["beginner", "intermediate", "advanced", "expert"];

    if (!validFields.includes(field)) {
      return NextResponse.json(
        { error: "Invalid field specified" },
        { status: 400 }
      );
    }

    if (!validLevels.includes(level)) {
      return NextResponse.json(
        { error: "Invalid level specified" },
        { status: 400 }
      );
    }

    // Mock certification data based on field and level
    const certificationData = {
      field,
      level,
      title: getCertificationTitle(field, level),
      description: getCertificationDescription(field, level),
      duration: getCertificationDuration(level),
      questions: getQuestionCount(level),
      passingScore: getPassingScore(level),
      price: getPrice(level),
      tags: getTags(field),
      requirements: getRequirements(level),
      learningObjectives: getLearningObjectives(field, level),
    };

    return NextResponse.json({
      success: true,
      data: certificationData,
    });
  } catch (error) {
    console.error("Certification API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getCertificationTitle(field: string, level: string): string {
  const titles: Record<string, Record<string, string>> = {
    programming: {
      beginner: "Programming Fundamentals",
      intermediate: "Full Stack Web Development",
      advanced: "Advanced Software Engineering",
      expert: "Software Architecture & Design",
    },
    design: {
      beginner: "UI/UX Design Fundamentals",
      intermediate: "Product Design & Prototyping",
      advanced: "Design Systems & Strategy",
      expert: "Design Leadership & Innovation",
    },
    marketing: {
      beginner: "Digital Marketing Basics",
      intermediate: "Marketing Strategy & Analytics",
      advanced: "Digital Marketing Strategy",
      expert: "Marketing Leadership & Growth",
    },
    business: {
      beginner: "Business Fundamentals",
      intermediate: "Business Strategy & Management",
      advanced: "Strategic Business Leadership",
      expert: "Business Innovation & Transformation",
    },
    "data-science": {
      beginner: "Data Science Fundamentals",
      intermediate: "Data Analysis & Visualization",
      advanced: "Machine Learning & AI",
      expert: "Advanced Analytics & AI Strategy",
    },
    cybersecurity: {
      beginner: "Cybersecurity Fundamentals",
      intermediate: "Network Security & Defense",
      advanced: "Advanced Security & Penetration Testing",
      expert: "Security Architecture & Leadership",
    },
  };

  return titles[field]?.[level] || `${field} ${level} certification`;
}

function getCertificationDescription(field: string, level: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    programming: {
      beginner:
        "Learn the fundamentals of programming and software development",
      intermediate:
        "Master modern web development with React, Node.js, and MongoDB",
      advanced: "Advanced software engineering principles and practices",
      expert: "Software architecture, design patterns, and system design",
    },
    design: {
      beginner:
        "Learn the principles of user interface and user experience design",
      intermediate: "Master product design, prototyping, and user research",
      advanced: "Design systems, strategy, and advanced UX methodologies",
      expert: "Design leadership, innovation, and strategic design thinking",
    },
    marketing: {
      beginner:
        "Understand the basics of digital marketing and online advertising",
      intermediate:
        "Develop comprehensive marketing strategies and analytics skills",
      advanced: "Advanced digital marketing strategies for business growth",
      expert: "Marketing leadership, growth strategies, and innovation",
    },
    business: {
      beginner: "Learn fundamental business concepts and entrepreneurship",
      intermediate: "Business strategy, management, and operational excellence",
      advanced: "Strategic business leadership and organizational development",
      expert: "Business innovation, transformation, and strategic leadership",
    },
    "data-science": {
      beginner: "Introduction to data science and basic analytics",
      intermediate: "Data analysis, visualization, and statistical modeling",
      advanced: "Machine learning, AI, and advanced predictive analytics",
      expert: "Advanced analytics, AI strategy, and data-driven leadership",
    },
    cybersecurity: {
      beginner: "Learn essential cybersecurity concepts and best practices",
      intermediate: "Network security, defense strategies, and threat analysis",
      advanced: "Advanced security techniques and penetration testing",
      expert:
        "Security architecture, leadership, and strategic security planning",
    },
  };

  return (
    descriptions[field]?.[level] ||
    `Comprehensive ${level} level certification in ${field}`
  );
}

function getCertificationDuration(level: string): string {
  const durations: Record<string, string> = {
    beginner: "4-6 weeks",
    intermediate: "8-12 weeks",
    advanced: "12-16 weeks",
    expert: "16-20 weeks",
  };

  return durations[level] || "8-12 weeks";
}

function getQuestionCount(level: string): number {
  const counts: Record<string, number> = {
    beginner: 30,
    intermediate: 50,
    advanced: 70,
    expert: 100,
  };

  return counts[level] || 50;
}

function getPassingScore(level: string): number {
  const scores: Record<string, number> = {
    beginner: 70,
    intermediate: 75,
    advanced: 80,
    expert: 85,
  };

  return scores[level] || 75;
}

function getPrice(level: string): number {
  const prices: Record<string, number> = {
    beginner: 199,
    intermediate: 299,
    advanced: 399,
    expert: 599,
  };

  return prices[level] || 299;
}

function getTags(field: string): string[] {
  const tags: Record<string, string[]> = {
    programming: ["JavaScript", "React", "Node.js", "MongoDB", "TypeScript"],
    design: [
      "Figma",
      "Adobe XD",
      "Prototyping",
      "User Research",
      "Design Systems",
    ],
    marketing: [
      "SEO",
      "Social Media",
      "Content Marketing",
      "Analytics",
      "Growth",
    ],
    business: [
      "Strategy",
      "Management",
      "Leadership",
      "Innovation",
      "Operations",
    ],
    "data-science": [
      "Python",
      "SQL",
      "Machine Learning",
      "Tableau",
      "Statistics",
    ],
    cybersecurity: [
      "Network Security",
      "Ethical Hacking",
      "Risk Management",
      "Compliance",
    ],
  };

  return tags[field] || [field];
}

function getRequirements(level: string): string[] {
  const requirements: Record<string, string[]> = {
    beginner: [
      "No prior experience required",
      "Basic computer skills",
      "Willingness to learn",
    ],
    intermediate: [
      "Basic knowledge of the field",
      "Some practical experience",
      "Commitment to learning",
    ],
    advanced: [
      "Intermediate experience in the field",
      "Portfolio of work",
      "Strong analytical skills",
    ],
    expert: [
      "Advanced experience in the field",
      "Leadership experience",
      "Strategic thinking abilities",
    ],
  };

  return (
    requirements[level] || ["Basic computer skills", "Willingness to learn"]
  );
}

function getLearningObjectives(field: string, level: string): string[] {
  const objectives: Record<string, Record<string, string[]>> = {
    programming: {
      beginner: [
        "Understand programming fundamentals",
        "Learn basic syntax and logic",
        "Build simple applications",
      ],
      intermediate: [
        "Master full-stack development",
        "Build scalable web applications",
        "Implement modern development practices",
      ],
      advanced: [
        "Advanced software engineering principles",
        "System design and architecture",
        "Performance optimization and scaling",
      ],
      expert: [
        "Software architecture design",
        "Technical leadership",
        "Innovation and best practices",
      ],
    },
    design: {
      beginner: [
        "Learn UI/UX design principles",
        "Master design tools and software",
        "Create user-centered designs",
      ],
      intermediate: [
        "Advanced prototyping techniques",
        "User research and testing",
        "Design system development",
      ],
      advanced: [
        "Strategic design thinking",
        "Design leadership skills",
        "Innovation in design",
      ],
      expert: [
        "Design strategy and innovation",
        "Leadership in design teams",
        "Design transformation",
      ],
    },
  };

  return (
    objectives[field]?.[level] || [
      `Master ${level} level concepts in ${field}`,
      `Develop practical skills in ${field}`,
      `Build a portfolio of ${field} work`,
    ]
  );
}

