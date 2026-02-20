import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { UserModel } from "@/models/User";
import { ObjectId } from "mongoose";

// Helper function for JSON responses
const jsonResponse = (status: number, message: string, data?: any) => {
  return NextResponse.json({ message, data }, { status });
};

// Endpoint handler
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Establish a database connection
    await connect();

    // Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session) {
      return jsonResponse(401, "Unauthorized: Please log in.");
    }

    // Parse the request body
    const { action, targetUserId }: { action: string; targetUserId: string } =
      await request.json();
    const currentUserId: string = session.user.id;

    if (!action || !targetUserId) {
      return jsonResponse(
        400,
        "Bad Request: Action and target user ID are required."
      );
    }

    // Fetch the current user and target user from the database
    const currentUser = await UserModel.findById(currentUserId).exec();
    const targetUser = await UserModel.findById(targetUserId).exec();

    if (!currentUser) {
      return jsonResponse(404, "Current user not found.");
    }
    if (!targetUser) {
      return jsonResponse(404, "Target user not found.");
    }

    // Ensure all required fields are initialized
    currentUser.friendRequestsSent = currentUser.friendRequestsSent || [];
    currentUser.friendRequestsReceived =
      currentUser.friendRequestsReceived || [];
    currentUser.connections = currentUser.connections || [];
    targetUser.friendRequestsSent = targetUser.friendRequestsSent || [];
    targetUser.friendRequestsReceived = targetUser.friendRequestsReceived || [];
    targetUser.connections = targetUser.connections || [];

    switch (action) {
      case "send": {
        if (currentUser.friendRequestsSent.includes(targetUserId)) {
          return jsonResponse(400, "Friend request already sent.");
        }
        if (currentUser.connections.includes(targetUserId)) {
          return jsonResponse(400, "You are already connected.");
        }

        currentUser.friendRequestsSent.push(targetUserId);
        targetUser.friendRequestsReceived.push(currentUserId);

        await currentUser.save();
        await targetUser.save();

        return jsonResponse(200, "Friend request sent successfully.");
      }

      case "accept": {
        if (!currentUser.friendRequestsReceived.includes(targetUserId)) {
          return jsonResponse(400, "No friend request from this user.");
        }

        currentUser.friendRequestsReceived =
          currentUser.friendRequestsReceived.filter(
            (userId: string | ObjectId) => userId.toString() !== targetUserId
          );
        targetUser.friendRequestsSent = targetUser.friendRequestsSent.filter(
          (userId: string | ObjectId) => userId.toString() !== currentUserId
        );

        currentUser.connections.push(targetUserId);
        targetUser.connections.push(currentUserId);

        await currentUser.save();
        await targetUser.save();

        return jsonResponse(200, "Friend request accepted successfully.");
      }

      case "reject": {
        if (!currentUser.friendRequestsReceived.includes(targetUserId)) {
          return jsonResponse(400, "No friend request from this user.");
        }

        currentUser.friendRequestsReceived =
          currentUser.friendRequestsReceived.filter(
            (userId: string | ObjectId) => userId.toString() !== targetUserId
          );
        targetUser.friendRequestsSent = targetUser.friendRequestsSent.filter(
          (userId: string | ObjectId) => userId.toString() !== currentUserId
        );

        await currentUser.save();
        await targetUser.save();

        return jsonResponse(200, "Friend request rejected successfully.");
      }

      default:
        return jsonResponse(400, "Invalid action specified.");
    }
  } catch (error: any) {
    console.error("Error processing friend request:", error.message);
    return jsonResponse(500, "Internal Server Error", { error: error.message });
  }
}
