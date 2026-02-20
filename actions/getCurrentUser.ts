import { getSession } from "@/lib/session";
import { UserModel } from "@/models/User";
import { connect } from "@/database";

const getCurrentUser = async () => {
  try {
    // Get session data
    const session = await getSession();
    if (!session?.user?.email) {
      return null;
    }

    await connect();

    // Find the user in the database by email
    const currentUser = await UserModel.findOne({ email: session.user.email });

    return currentUser || null;
  } catch (error: any) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

export default getCurrentUser;
