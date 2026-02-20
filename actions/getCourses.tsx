import { connect } from "../database/index"; // Ensure the database connection function is imported
import { CourseModel } from "@/models/Course"; // Import the Course model
import { CategoryModel } from "@/models/Category"; // Import the Category model
import { SubCategoryModel } from "@/models/SubCategory"; // Import the SubCategory model
import { LevelModel } from "@/models/Level"; // Import the Level model
import { SectionModel } from "@/models/Section"; // Import the Section model

const getCoursesByCategory = async (categoryId: string | null) => {
  // Connect to the database
  await connect();

  // Define the query conditions
  const queryConditions: any = {
    isPublished: true,
  };

  if (categoryId) {
    queryConditions.categoryId = categoryId;
  }

  const courses = await CourseModel.find(queryConditions)
    .populate("categoryId")
    .populate("subCategoryId")
    .populate("levelId")
    .populate({
      path: "sections",
      match: { isPublished: true },
    })
    .sort({ createdAt: "desc" });

  return courses;
};

export default getCoursesByCategory;
