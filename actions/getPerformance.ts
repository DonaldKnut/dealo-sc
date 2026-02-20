import { PurchaseModel } from "@/models/Purchase"; // Assuming this is the Mongoose model for Purchase
import { CourseModel } from "@/models/Course";

type PurchaseWithCourse = {
  course: {
    title: string;
    price: number;
  };
  amount: number;
  paymentDate: Date;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: { total: number; count: number } } =
    {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = { total: 0, count: 0 };
    }
    grouped[courseTitle].total += purchase.course.price;
    grouped[courseTitle].count += 1;
  });

  return grouped;
};

export const getPerformance = async (userId: string) => {
  try {
    // Fetch purchases and populate the associated course data
    const purchases = await PurchaseModel.aggregate([
      {
        $lookup: {
          from: "courses", // The MongoDB collection name for courses
          localField: "courseId", // The field in Purchase model that references Course
          foreignField: "_id", // The field in Course model that represents the unique ID
          as: "course", // Name for the joined data
        },
      },
      { $unwind: "$course" }, // Unwind the course array to make it an object
      { $match: { "course.instructorId": userId } }, // Filter purchases based on instructorId
    ]);

    // Group by course and calculate total and count
    const groupedEarnings = groupByCourse(purchases as PurchaseWithCourse[]);

    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, { total, count }]) => ({
        name: courseTitle,
        total,
        count,
      })
    );

    const totalRevenue = data.reduce((acc, current) => acc + current.total, 0);
    const totalSales = purchases.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (err) {
    console.log("[getPerformance]", err);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
