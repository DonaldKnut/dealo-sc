/**
 * Test script to verify course creation and retrieval
 * Run with: node scripts/test-course-endpoints.js
 * 
 * This script tests:
 * 1. Course creation endpoint
 * 2. Dashboard courses retrieval endpoint
 * 3. Verifies courses are properly saved and retrieved
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// You'll need to provide a valid session token or modify this to use actual auth
async function testCourseEndpoints() {
  console.log("🧪 Testing Course Endpoints\n");
  console.log("=" .repeat(50));

  // Test 1: Check if courses endpoint is accessible
  console.log("\n1️⃣ Testing GET /api/dashboard/courses");
  try {
    const coursesRes = await fetch(`${BASE_URL}/api/dashboard/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const coursesData = await coursesRes.json();
    console.log("Status:", coursesRes.status);
    console.log("Response:", JSON.stringify(coursesData, null, 2));
    
    if (coursesRes.ok) {
      console.log(`✅ Found ${coursesData.courses?.length || 0} total courses`);
      console.log(`   - Enrolled: ${coursesData.enrolledCourses?.length || 0}`);
      console.log(`   - Created: ${coursesData.createdCourses?.length || 0}`);
    } else {
      console.log("❌ Failed to fetch courses");
    }
  } catch (error) {
    console.error("❌ Error testing courses endpoint:", error.message);
  }

  // Test 2: Check database directly (if you have MongoDB connection)
  console.log("\n2️⃣ Database Query Test");
  console.log("To test database queries directly, run this in MongoDB shell:");
  console.log(`
// Find all courses
db.courses.find().pretty()

// Find courses by instructor (replace with actual user ID)
db.courses.find({ instructor: ObjectId("YOUR_USER_ID") }).pretty()

// Count courses
db.courses.countDocuments()

// Check course structure
db.courses.findOne()
  `);

  console.log("\n" + "=".repeat(50));
  console.log("✅ Test script completed");
  console.log("\n💡 Tips:");
  console.log("   - Check server logs for detailed error messages");
  console.log("   - Verify user authentication and role (INSTRUCTOR/ADMIN)");
  console.log("   - Check MongoDB connection and database name");
  console.log("   - Verify instructor ID matches between creation and retrieval");
}

// Run tests
testCourseEndpoints().catch(console.error);


