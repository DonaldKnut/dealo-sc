import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { JobModel } from "@/models/Job";
import { UserModel } from "@/models/User";
import { UserProfileModel } from "@/models/UserProfile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";

export const dynamic = "force-dynamic";

interface JobScore {
  job: any;
  score: number;
  reasons: string[];
}

// Calculate job match score based on user profile
function calculateJobScore(job: any, userProfile: any, user: any): JobScore {
  let score = 0;
  const reasons: string[] = [];

  // 1. Skills Match (40% weight)
  if (userProfile?.skills && job.skillsRequired) {
    const userSkills = userProfile.skills.map((s: string) => s.toLowerCase());
    const jobSkills = job.skillsRequired.map((s: string) => s.toLowerCase());
    const matchingSkills = jobSkills.filter((skill: string) =>
      userSkills.some((userSkill: string) =>
        userSkill.includes(skill) || skill.includes(userSkill)
      )
    );
    const skillsMatchRatio = matchingSkills.length / Math.max(jobSkills.length, 1);
    score += skillsMatchRatio * 40;
    if (matchingSkills.length > 0) {
      reasons.push(`Matches ${matchingSkills.length} of your skills`);
    }
  }

  // 2. Location Match (20% weight)
  if (userProfile?.location && job.location) {
    const userLocation = userProfile.location.toLowerCase();
    const jobLocation = job.location.toLowerCase();
    if (job.remote) {
      score += 20;
      reasons.push("Remote position available");
    } else if (
      userLocation.includes(jobLocation) ||
      jobLocation.includes(userLocation)
    ) {
      score += 20;
      reasons.push("Location matches your profile");
    } else if (job.city && userLocation.includes(job.city.toLowerCase())) {
      score += 15;
      reasons.push("City matches your location");
    }
  } else if (job.remote) {
    score += 20;
    reasons.push("Remote position");
  }

  // 3. Experience Level Match (15% weight)
  if (user?.experience && job.experienceRequired) {
    const userExp = user.experience.toLowerCase();
    const jobExp = job.experienceRequired.toString().toLowerCase();
    
    if (jobExp.includes("entry") && (userExp.includes("entry") || userExp.includes("junior"))) {
      score += 15;
      reasons.push("Matches your experience level");
    } else if (jobExp.includes("mid") && (userExp.includes("mid") || userExp.includes("intermediate"))) {
      score += 15;
      reasons.push("Matches your experience level");
    } else if (jobExp.includes("senior") && (userExp.includes("senior") || userExp.includes("expert"))) {
      score += 15;
      reasons.push("Matches your experience level");
    }
  }

  // 4. Interests/Category Match (15% weight)
  if (user?.interests && job.category) {
    const userInterests = user.interests.map((i: string) => i.toLowerCase());
    const jobCategory = job.category.toLowerCase();
    const hasMatchingInterest = userInterests.some((interest: string) =>
      jobCategory.includes(interest) || interest.includes(jobCategory)
    );
    if (hasMatchingInterest) {
      score += 15;
      reasons.push("Matches your interests");
    }
  }

  // 5. Job Type Preference (10% weight)
  // Assuming user might prefer certain types - can be enhanced with user preferences
  if (job.type === "full-time") {
    score += 5; // Full-time is generally preferred
  }
  if (job.type === "remote" || job.remote) {
    score += 5;
  }

  // 6. Recent/Featured Boost
  if (job.isFeatured) {
    score += 5;
    reasons.push("Featured opportunity");
  }

  // 7. Budget/Salary Match (if user has salary expectations)
  if (job.budget && job.budget > 0) {
    score += 5; // Any salary is better than no salary
  }

  return {
    job,
    score: Math.min(score, 100), // Cap at 100
    reasons: reasons.length > 0 ? reasons : ["General match"],
  };
}

export async function GET(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Fetch user and profile
    const [user, userProfile] = await Promise.all([
      UserModel.findById(userId).lean(),
      UserProfileModel.findOne({ userId }).lean(),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Fetch all active, verified jobs
    const allJobs = await JobModel.find({
      status: "Active",
      $or: [
        { isEmailVerified: { $exists: false } },
        { isEmailVerified: true },
      ],
    })
      .populate("postedBy", "firstName lastName email avatar")
      .populate("company", "name logo")
      .sort({ createdAt: -1 })
      .limit(100) // Limit for performance, then score and sort
      .lean();

    // Calculate scores for each job
    const jobsWithScores: JobScore[] = allJobs.map((job) =>
      calculateJobScore(job, userProfile, user)
    );

    // Sort by score (highest first)
    jobsWithScores.sort((a, b) => b.score - a.score);

    // Get top 20 personalized jobs
    const personalizedJobs = jobsWithScores.slice(0, 20).map((item) => ({
      ...item.job,
      _id: item.job._id.toString(),
      matchScore: Math.round(item.score),
      matchReasons: item.reasons,
      postedBy: item.job.postedBy
        ? {
            _id: item.job.postedBy._id?.toString(),
            name: `${item.job.postedBy.firstName || ""} ${item.job.postedBy.lastName || ""}`.trim(),
            email: item.job.postedBy.email,
            avatar: item.job.postedBy.avatar,
          }
        : undefined,
      company: item.job.company
        ? {
            _id: item.job.company._id?.toString(),
            name: item.job.company.name,
            logo: item.job.company.logo,
          }
        : undefined,
      deadline: item.job.deadline?.toISOString(),
      createdAt: item.job.createdAt?.toISOString(),
      updatedAt: item.job.updatedAt?.toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        jobs: personalizedJobs,
        total: personalizedJobs.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching personalized jobs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch personalized jobs" },
      { status: 500 }
    );
  }
}



