import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { CourseModel } from "@/models/Course";
import { UserModel } from "@/models/User";
import { requireAuth } from "@/lib/middleware/auth";
import { requireRole } from "@/lib/middleware/rbac";
import { rateLimiters } from "@/lib/middleware/rate-limit";
import { Role } from "@/types/role";
import { sanitizeFindQuery } from "@/lib/validation/db-sanitize";

export async function GET(request: NextRequest) {
  try {
    await connect();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const level = searchParams.get("level");
    const sortBy = searchParams.get("sortBy") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");
    const mine = searchParams.get("mine") === "true";
    const instructor = searchParams.get("instructor");
    
    // Optional session for "mine" filter - public route
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/authOptions/authOptions");
    const session = await getServerSession(authOptions);
    
    // Build query - sanitize user inputs
    const query: any = { "status": "published" };
    
    if (search) {
      // Sanitize search query to prevent injection
      const sanitizedSearch = search.trim().replace(/[<>]/g, "");
      query.$or = [
        { title: { $regex: sanitizedSearch, $options: "i" } },
        { description: { $regex: sanitizedSearch, $options: "i" } },
        { tags: { $in: [new RegExp(sanitizedSearch, "i")] } },
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (level) {
      query.level = level;
    }
    
    if (mine && session?.user?.id) {
      query.instructor = session.user.id;
    }
    
    if (instructor) {
      query.instructor = instructor;
    }
    
    // Build sort
    let sort: any = {};
    switch (sortBy) {
      case "newest":
        sort["metadata.createdAt"] = -1;
        break;
      case "oldest":
        sort["metadata.createdAt"] = 1;
        break;
      case "title":
        sort.title = 1;
        break;
      case "popular":
        sort["enrollment.total"] = -1;
        break;
      default:
        sort["metadata.createdAt"] = -1;
    }
    
    // Execute query
    const skip = (page - 1) * pageSize;
    const courses = await CourseModel.find(query)
      .populate("instructor", "name email avatar")
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .lean();
    
    // Optimize count query - use estimated count for non-filtered queries
    const total = search || category || level || mine || instructor
      ? await CourseModel.countDocuments(query)
      : await CourseModel.estimatedDocumentCount({ status: "published" });
    
    const response = NextResponse.json({
      courses,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
    
    // Add cache headers for non-personal queries
    if (!mine && !instructor && !search) {
      response.headers.set(
        "Cache-Control",
        "public, s-maxage=60, stale-while-revalidate=120"
      );
    }
    
    return response;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication and instructor role
    const user = await requireRole(request, [Role.INSTRUCTOR, Role.ADMIN]);
    
    // Apply rate limiting for course creation
    const rateLimitResult = await rateLimiters.moderate(request, user.id);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": Math.ceil(rateLimitResult.resetTime / 1000).toString(),
            "Retry-After": Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }
    
    await connect();
    
    // Sanitize input data
    const sanitizedBody = sanitizeFindQuery(body);
    
    // Check if slug already exists
    const existingCourse = await CourseModel.findOne({ slug: sanitizedBody.slug });
    if (existingCourse) {
      return NextResponse.json(
        { error: "Course with this slug already exists" },
        { status: 400 }
      );
    }
    
    // Find the actual MongoDB user document
    // user.id from requireRole might be an OAuth provider ID, not a MongoDB ObjectId
    await connect();
    const mongoose = await import("mongoose");
    
    let userDoc = null as any;
    
    // Try to find user by ID if it's a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(user.id)) {
      try {
        userDoc = await UserModel.findById(user.id).select("_id");
      } catch (e) {
        // Not a valid ObjectId, continue to email lookup
      }
    }
    
    // For OAuth users, find by email (most reliable)
    if (!userDoc && user.email) {
      userDoc = await UserModel.findOne({ email: user.email }).select("_id");
    }
    
    if (!userDoc) {
      console.error("User not found for course creation:", {
        userId: user.id,
        email: user.email,
      });
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Use the MongoDB user's _id as the instructor
    const instructorId = userDoc._id;

    // Create course
    const course = await CourseModel.create({
      ...sanitizedBody,
      instructor: instructorId,
      status: "draft", // Start as draft
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      },
    });

    console.log("Course created successfully:", {
      courseId: course._id,
      instructorId: instructorId.toString(),
      instructorEmail: user.email,
      title: course.title,
    });
    
    // Populate instructor info (don't expose email - sensitive data)
    await course.populate("instructor", "name avatar");
    
    const response = NextResponse.json(
      {
        message: "Course created successfully",
        course,
      },
      { status: 201 }
    );
    
    // Add rate limit headers
    response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString());
    response.headers.set("X-RateLimit-Reset", Math.ceil(rateLimitResult.resetTime / 1000).toString());
    
    return response;
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
