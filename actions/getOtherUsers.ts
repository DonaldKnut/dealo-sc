import { getSession } from "@/lib/session";
import { UserModel } from "@/models/User";
import { connect } from "@/database";

const getOtherUsers = async () => {
  try {
    // Get session data
    const session = await getSession();
    if (!session?.user?.email) {
      return [];
    }

    await connect();

    // Find users whose emails are different from the user in the session
    const otherUsers = await UserModel.find({
      email: { $ne: session.user.email },
    }).sort({ createdAt: -1 }); // Sort by `createdAt` in descending order

    return otherUsers;
  } catch (error: any) {
    console.error("Error fetching other users:", error);
    return [];
  }
};

export default getOtherUsers;
