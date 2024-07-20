import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import { User } from "next-auth";


export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const messageId= params.messageid
  await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user: User = session?.user;
        if (!session || !session.user) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }
        const userMessages = await UserModel.updateOne(
            { _id: user._id, 'messages._id': messageId },
            { $set: { 'messages.$.is_delete': true } }
          );
    if (userMessages.matchedCount==0) {
      return Response.json(
        {
          success: false,
          message: "Not deleted",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message Deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to delete",
      },
      {
        status: 500,
      }
    );
  }
}
