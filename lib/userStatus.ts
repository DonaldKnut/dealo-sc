import { UserModel } from "@/models/User"; // Update the import path as necessary

/**
 * Updates the user's status in the database.
 * @param userId - The ID of the user.
 * @param status - The status to set (e.g., "ONLINE", "OFFLINE").
 */
export async function updateUserStatus(
  userId: string,
  status: string
): Promise<void> {
  if (!userId) throw new Error("User ID is required to update status");

  await UserModel.findByIdAndUpdate(userId, { status }, { new: true });
}
