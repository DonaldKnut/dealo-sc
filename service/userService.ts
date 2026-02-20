import { UserModel } from "@/models/User";

// Fetch user by email
export const getUserByEmail = async (email: string) => {
  try {
    const user = await UserModel.findOne({ email }).exec();
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Database query failed");
  }
};

// Update user password
export const updateUserPassword = async (
  email: string,
  hashedPassword: string
) => {
  try {
    await UserModel.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    ).exec();
  } catch (error) {
    console.error("Error updating user password:", error);
    throw new Error("Database update failed");
  }
};
