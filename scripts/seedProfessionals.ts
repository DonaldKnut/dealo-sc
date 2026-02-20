import { connect } from "@/database";
import { ProfessionalModel } from "@/models/Professional";
import { UserModel } from "@/models/User";
import bcrypt from "bcryptjs";

const professionals = [
  {
    firstName: "Sarah",
    lastName: "Chen",
    email: "sarah.chen@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    role: "FREELANCER" as const,
    isCertified: true,
    isVerified: true,
    isProfileComplete: true,
    isAvailable: true,
    experience: "5+ years",
    servicesOffered: ["Web Development", "UI/UX Design", "Mobile Development"],
    serviceArea: "Remote",
    rating: 4.9,
    totalReviews: 127,
    completedProjects: 89,
    hourlyRate: "$75",
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "Figma",
      "React Native",
      "MongoDB",
    ],
    bio: "Full-stack developer with 5+ years of experience building scalable web and mobile applications. Specialized in React ecosystem and modern JavaScript frameworks.",
    portfolio: [
      {
        title: "E-commerce Platform",
        description:
          "Built a complete e-commerce solution with React, Node.js, and Stripe integration",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
        link: "https://example.com/ecommerce",
      },
      {
        title: "Mobile Banking App",
        description:
          "Developed a secure mobile banking application with React Native and biometric authentication",
        image:
          "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400",
        link: "https://example.com/banking-app",
      },
    ],
    certifications: [
      {
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: new Date("2023-06-15"),
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400",
      },
      {
        name: "Google Cloud Professional Developer",
        issuer: "Google",
        date: new Date("2023-03-20"),
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400",
      },
    ],
    education: [
      {
        degree: "Bachelor of Computer Science",
        institution: "Stanford University",
        year: 2019,
      },
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahchen",
      github: "https://github.com/sarahchen",
      website: "https://sarahchen.dev",
    },
    specializations: [
      "Frontend Development",
      "Mobile Development",
      "UI/UX Design",
    ],
    languages: ["English", "Mandarin"],
    availability: {
      available: true,
      schedule: "Monday - Friday, 9 AM - 6 PM PST",
      timezone: "America/Los_Angeles",
    },
  },
  {
    firstName: "Marcus",
    lastName: "Johnson",
    email: "marcus.johnson@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    role: "CONSULTANT" as const,
    isCertified: true,
    isVerified: true,
    isProfileComplete: true,
    isAvailable: true,
    experience: "8+ years",
    servicesOffered: [
      "Business Strategy",
      "Digital Transformation",
      "Product Management",
    ],
    serviceArea: "Remote",
    rating: 4.8,
    totalReviews: 203,
    completedProjects: 156,
    hourlyRate: "$120",
    skills: [
      "Strategic Planning",
      "Product Strategy",
      "Digital Marketing",
      "Data Analysis",
      "Agile",
      "Scrum",
    ],
    bio: "Senior business consultant with 8+ years helping startups and enterprises scale their operations through digital transformation and strategic planning.",
    portfolio: [
      {
        title: "Tech Startup Scaling",
        description:
          "Helped a SaaS startup scale from 10 to 100+ employees and $10M ARR",
        image:
          "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400",
        link: "https://example.com/startup-case-study",
      },
      {
        title: "Digital Transformation",
        description:
          "Led digital transformation for a Fortune 500 company, resulting in 40% efficiency improvement",
        image:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
        link: "https://example.com/transformation-case-study",
      },
    ],
    certifications: [
      {
        name: "Certified Scrum Master",
        issuer: "Scrum Alliance",
        date: new Date("2022-08-10"),
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400",
      },
      {
        name: "PMP Certification",
        issuer: "Project Management Institute",
        date: new Date("2021-11-15"),
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400",
      },
    ],
    education: [
      {
        degree: "MBA",
        institution: "Harvard Business School",
        year: 2016,
      },
      {
        degree: "Bachelor of Business Administration",
        institution: "University of Michigan",
        year: 2014,
      },
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/in/marcusjohnson",
      twitter: "https://twitter.com/marcusjohnson",
      website: "https://marcusjohnson.com",
    },
    specializations: [
      "Business Strategy",
      "Digital Transformation",
      "Product Management",
    ],
    languages: ["English", "Spanish"],
    availability: {
      available: true,
      schedule: "Monday - Friday, 8 AM - 7 PM EST",
      timezone: "America/New_York",
    },
  },
  {
    firstName: "Aisha",
    lastName: "Okafor",
    email: "aisha.okafor@example.com",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    role: "INSTRUCTOR" as const,
    isCertified: true,
    isVerified: true,
    isProfileComplete: true,
    isAvailable: true,
    experience: "6+ years",
    servicesOffered: ["Data Science", "Machine Learning", "Python Programming"],
    serviceArea: "Remote",
    rating: 4.9,
    totalReviews: 89,
    completedProjects: 67,
    hourlyRate: "$90",
    skills: [
      "Python",
      "Machine Learning",
      "Data Analysis",
      "TensorFlow",
      "PyTorch",
      "SQL",
      "Statistics",
    ],
    bio: "Data science instructor and consultant with expertise in machine learning, statistical analysis, and Python programming. Passionate about teaching and helping others master data science skills.",
    portfolio: [
      {
        title: "ML Course Series",
        description:
          "Created comprehensive machine learning courses with 10,000+ students enrolled",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
        link: "https://example.com/ml-courses",
      },
      {
        title: "Predictive Analytics Project",
        description:
          "Built predictive models for customer churn analysis with 95% accuracy",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
        link: "https://example.com/predictive-analytics",
      },
    ],
    certifications: [
      {
        name: "Google TensorFlow Developer Certificate",
        issuer: "Google",
        date: new Date("2023-09-20"),
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400",
      },
      {
        name: "AWS Machine Learning Specialty",
        issuer: "Amazon Web Services",
        date: new Date("2023-05-12"),
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400",
      },
    ],
    education: [
      {
        degree: "Master of Data Science",
        institution: "University of California, Berkeley",
        year: 2018,
      },
      {
        degree: "Bachelor of Mathematics",
        institution: "University of Lagos",
        year: 2016,
      },
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/in/aishaokafor",
      github: "https://github.com/aishaokafor",
      website: "https://aishaokafor.com",
    },
    specializations: ["Machine Learning", "Data Science", "Python Programming"],
    languages: ["English", "Yoruba", "French"],
    availability: {
      available: true,
      schedule: "Monday - Saturday, 10 AM - 8 PM WAT",
      timezone: "Africa/Lagos",
    },
  },
  {
    firstName: "David",
    lastName: "Kim",
    email: "david.kim@example.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    role: "FREELANCER" as const,
    isCertified: true,
    isVerified: true,
    isProfileComplete: true,
    isAvailable: true,
    experience: "4+ years",
    servicesOffered: ["Content Writing", "SEO", "Digital Marketing"],
    serviceArea: "Remote",
    rating: 4.7,
    totalReviews: 156,
    completedProjects: 234,
    hourlyRate: "$45",
    skills: [
      "Content Writing",
      "SEO",
      "Digital Marketing",
      "Copywriting",
      "Social Media",
      "Google Analytics",
    ],
    bio: "Versatile content writer and digital marketer with expertise in SEO, copywriting, and social media marketing. Helping businesses grow their online presence through compelling content.",
    portfolio: [
      {
        title: "E-commerce Content Strategy",
        description:
          "Developed content strategy for an e-commerce brand, resulting in 300% increase in organic traffic",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
        link: "https://example.com/ecommerce-content",
      },
      {
        title: "SaaS Blog Series",
        description:
          "Created 50+ high-converting blog posts for a SaaS company, driving 200% increase in leads",
        image:
          "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400",
        link: "https://example.com/saas-blog",
      },
    ],
    certifications: [
      {
        name: "Google Analytics Individual Qualification",
        issuer: "Google",
        date: new Date("2023-01-15"),
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400",
      },
      {
        name: "HubSpot Content Marketing Certification",
        issuer: "HubSpot",
        date: new Date("2022-11-08"),
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400",
      },
    ],
    education: [
      {
        degree: "Bachelor of Communications",
        institution: "University of Toronto",
        year: 2020,
      },
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/in/davidkim",
      twitter: "https://twitter.com/davidkim",
      website: "https://davidkimwrites.com",
    },
    specializations: ["Content Writing", "SEO", "Digital Marketing"],
    languages: ["English", "Korean"],
    availability: {
      available: true,
      schedule: "Monday - Friday, 9 AM - 6 PM EST",
      timezone: "America/Toronto",
    },
  },
  {
    firstName: "Elena",
    lastName: "Rodriguez",
    email: "elena.rodriguez@example.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    role: "MENTOR" as const,
    isCertified: true,
    isVerified: true,
    isProfileComplete: true,
    isAvailable: true,
    experience: "10+ years",
    servicesOffered: [
      "Career Coaching",
      "Leadership Development",
      "Personal Branding",
    ],
    serviceArea: "Remote",
    rating: 4.9,
    totalReviews: 78,
    completedProjects: 45,
    hourlyRate: "$150",
    skills: [
      "Career Coaching",
      "Leadership Development",
      "Personal Branding",
      "Public Speaking",
      "Executive Coaching",
      "Team Building",
    ],
    bio: "Executive coach and leadership mentor with 10+ years of experience helping professionals advance their careers and develop strong leadership skills. Former Fortune 500 executive.",
    portfolio: [
      {
        title: "Executive Leadership Program",
        description:
          "Coached 50+ executives through leadership transitions, with 90% achieving promotion within 18 months",
        image:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
        link: "https://example.com/leadership-program",
      },
      {
        title: "Career Transition Success",
        description:
          "Helped 200+ professionals successfully transition careers with 85% success rate",
        image:
          "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400",
        link: "https://example.com/career-transition",
      },
    ],
    certifications: [
      {
        name: "International Coach Federation (ICF) Professional Certified Coach",
        issuer: "ICF",
        date: new Date("2021-03-20"),
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400",
      },
      {
        name: "Marshall Goldsmith Stakeholder Centered Coaching",
        issuer: "Marshall Goldsmith",
        date: new Date("2020-09-15"),
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400",
      },
    ],
    education: [
      {
        degree: "Master of Organizational Psychology",
        institution: "Columbia University",
        year: 2014,
      },
      {
        degree: "Bachelor of Psychology",
        institution: "University of Madrid",
        year: 2012,
      },
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/in/elenarodriguez",
      twitter: "https://twitter.com/elenarodriguez",
      website: "https://elenarodriguez.com",
    },
    specializations: [
      "Executive Coaching",
      "Leadership Development",
      "Career Transition",
    ],
    languages: ["English", "Spanish", "Portuguese"],
    availability: {
      available: true,
      schedule: "Monday - Friday, 8 AM - 7 PM EST",
      timezone: "America/New_York",
    },
  },
  {
    firstName: "James",
    lastName: "Thompson",
    email: "james.thompson@example.com",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    role: "FREELANCER" as const,
    isCertified: true,
    isVerified: true,
    isProfileComplete: true,
    isAvailable: true,
    experience: "7+ years",
    servicesOffered: ["Video Production", "Animation", "Motion Graphics"],
    serviceArea: "Remote",
    rating: 4.8,
    totalReviews: 134,
    completedProjects: 189,
    hourlyRate: "$85",
    skills: [
      "Video Editing",
      "Motion Graphics",
      "3D Animation",
      "After Effects",
      "Premiere Pro",
      "Cinema 4D",
      "Blender",
    ],
    bio: "Creative video producer and motion graphics artist with 7+ years of experience creating compelling visual content for brands, startups, and agencies worldwide.",
    portfolio: [
      {
        title: "Brand Commercial Series",
        description:
          "Created 20+ TV commercials for major brands, reaching 10M+ viewers",
        image:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        link: "https://example.com/brand-commercials",
      },
      {
        title: "Product Launch Videos",
        description:
          "Produced launch videos for 50+ tech products with 95% client satisfaction",
        image:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        link: "https://example.com/product-launches",
      },
    ],
    certifications: [
      {
        name: "Adobe Certified Expert - After Effects",
        issuer: "Adobe",
        date: new Date("2023-04-12"),
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400",
      },
      {
        name: "Cinema 4D Certified Professional",
        issuer: "Maxon",
        date: new Date("2022-11-30"),
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400",
      },
    ],
    education: [
      {
        degree: "Bachelor of Film and Media Arts",
        institution: "New York University",
        year: 2017,
      },
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/in/jamesthompson",
      instagram: "https://instagram.com/jamesthompson",
      website: "https://jamesthompson.com",
    },
    specializations: ["Video Production", "Motion Graphics", "3D Animation"],
    languages: ["English"],
    availability: {
      available: true,
      schedule: "Monday - Friday, 10 AM - 8 PM EST",
      timezone: "America/New_York",
    },
  },
  {
    firstName: "Fatima",
    lastName: "Al-Zahra",
    email: "fatima.alzahra@example.com",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
    role: "INSTRUCTOR" as const,
    isCertified: true,
    isVerified: true,
    isProfileComplete: true,
    isAvailable: true,
    experience: "5+ years",
    servicesOffered: [
      "Arabic Language",
      "Islamic Studies",
      "Cultural Consulting",
    ],
    serviceArea: "Remote",
    rating: 4.9,
    totalReviews: 67,
    completedProjects: 89,
    hourlyRate: "$60",
    skills: [
      "Arabic Language",
      "Islamic Studies",
      "Cultural Consulting",
      "Translation",
      "Curriculum Development",
      "Online Teaching",
    ],
    bio: "Experienced Arabic language instructor and cultural consultant with expertise in teaching Arabic to non-native speakers and providing cultural insights for businesses operating in the Middle East.",
    portfolio: [
      {
        title: "Arabic Language Program",
        description:
          "Developed comprehensive Arabic language curriculum for 500+ students across 30 countries",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
        link: "https://example.com/arabic-program",
      },
      {
        title: "Cultural Training Workshops",
        description:
          "Conducted cultural sensitivity training for 20+ multinational companies",
        image:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
        link: "https://example.com/cultural-training",
      },
    ],
    certifications: [
      {
        name: "Teaching Arabic as a Foreign Language",
        issuer: "American University in Cairo",
        date: new Date("2022-06-15"),
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400",
      },
      {
        name: "Islamic Studies Certificate",
        issuer: "Al-Azhar University",
        date: new Date("2021-09-20"),
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400",
      },
    ],
    education: [
      {
        degree: "Master of Arabic Literature",
        institution: "Cairo University",
        year: 2019,
      },
      {
        degree: "Bachelor of Islamic Studies",
        institution: "Al-Azhar University",
        year: 2017,
      },
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/in/fatimaalzahra",
      website: "https://fatimaalzahra.com",
    },
    specializations: [
      "Arabic Language",
      "Islamic Studies",
      "Cultural Consulting",
    ],
    languages: ["Arabic", "English", "French"],
    availability: {
      available: true,
      schedule: "Sunday - Thursday, 9 AM - 7 PM GST",
      timezone: "Asia/Dubai",
    },
  },
  {
    firstName: "Alex",
    lastName: "Wong",
    email: "alex.wong@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    role: "FREELANCER" as const,
    isCertified: true,
    isVerified: true,
    isProfileComplete: true,
    isAvailable: true,
    experience: "6+ years",
    servicesOffered: ["Blockchain Development", "Smart Contracts", "DeFi"],
    serviceArea: "Remote",
    rating: 4.7,
    totalReviews: 98,
    completedProjects: 76,
    hourlyRate: "$110",
    skills: [
      "Solidity",
      "Ethereum",
      "Smart Contracts",
      "DeFi",
      "Web3",
      "React",
      "Node.js",
    ],
    bio: "Blockchain developer and DeFi expert with 6+ years of experience building decentralized applications, smart contracts, and DeFi protocols on Ethereum and other blockchains.",
    portfolio: [
      {
        title: "DeFi Lending Protocol",
        description:
          "Built a complete DeFi lending protocol with $50M+ TVL and 10,000+ users",
        image:
          "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400",
        link: "https://example.com/defi-protocol",
      },
      {
        title: "NFT Marketplace",
        description:
          "Developed an NFT marketplace with 100,000+ transactions and $2M+ volume",
        image:
          "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400",
        link: "https://example.com/nft-marketplace",
      },
    ],
    certifications: [
      {
        name: "Ethereum Developer Certification",
        issuer: "Ethereum Foundation",
        date: new Date("2023-08-15"),
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400",
      },
      {
        name: "Chainlink Certified Developer",
        issuer: "Chainlink",
        date: new Date("2023-05-20"),
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400",
      },
    ],
    education: [
      {
        degree: "Bachelor of Computer Science",
        institution: "University of British Columbia",
        year: 2018,
      },
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/in/alexwong",
      github: "https://github.com/alexwong",
      website: "https://alexwong.dev",
    },
    specializations: ["Blockchain Development", "Smart Contracts", "DeFi"],
    languages: ["English", "Mandarin"],
    availability: {
      available: true,
      schedule: "Monday - Friday, 9 AM - 7 PM PST",
      timezone: "America/Vancouver",
    },
  },
];

async function seedProfessionals() {
  try {
    await connect();
    console.log("Connected to database");

    // Clear existing professionals
    await ProfessionalModel.deleteMany({});
    console.log("Cleared existing professionals");

    // Create users for each professional
    const createdUsers = [];
    for (const prof of professionals) {
      const hashedPassword = await bcrypt.hash("password123", 12);

      const user = await UserModel.create({
        firstName: prof.firstName,
        lastName: prof.lastName,
        email: prof.email,
        password: hashedPassword,
        role: "FREELANCER",
        dateOfBirth: new Date("1990-01-01"),
        isEmailVerified: true,
        isProfileComplete: true,
        avatar: prof.avatar,
        servicesOffered: prof.servicesOffered,
        serviceArea: prof.serviceArea,
        isAvailable: prof.isAvailable,
        experience: prof.experience,
      });

      createdUsers.push(user);
    }

    // Create professionals with user references
    const createdProfessionals = [];
    for (let i = 0; i < professionals.length; i++) {
      const prof = professionals[i];
      const user = createdUsers[i];

      const professional = await ProfessionalModel.create({
        ...prof,
        userId: user._id,
      });

      createdProfessionals.push(professional);
    }

    console.log(
      `Successfully seeded ${createdProfessionals.length} professionals`
    );
    console.log("Professional emails for testing:");
    professionals.forEach((prof) => {
      console.log(`${prof.email} (password: password123)`);
    });
  } catch (error) {
    console.error("Error seeding professionals:", error);
  } finally {
    process.exit(0);
  }
}

seedProfessionals();
