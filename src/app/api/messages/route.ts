import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";
import { Message } from "@/models/User";
export async function GET(request: Request) {
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
    const userId = new mongoose.Types.ObjectId(user._id);
    const userMessages = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      {
        $match: { "messages.is_delete": { $ne: true } },
      },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", is_accepting_message: { $first: "$is_accepting_message" }, short_url: { $first: "$short_url" } , messages: { $push: "$messages" } } },
    ]);
    if (!userMessages || userMessages.length == 0) {
      return Response.json(
        {
          success: false,
          message: "No message Found",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Success",
        messages: userMessages[0].messages,
        is_accepting_message:userMessages[0].is_accepting_message
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to updated",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { _id, message } = await request.json();
    const user = await UserModel.findById({ _id: _id });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Failed to fetch",
        },
        {
          status: 404,
        }
      );
    }
    if (!user.is_accepting_message) {
      return Response.json(
        {
          success: false,
          message: "User not accepting messages",
        },
        {
          status: 403,
        }
      );
    }
    const newMessage = { message, insert_ts: new Date(), is_delete: false };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Success",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch",
      },
      {
        status: 500,
      }
    );
  }
}

// export async function DELETE(request: Request) {
//   await dbConnect();
//   try {
//     const session = await getServerSession(authOptions);
//     const user: User = session?.user;
//     if (!session || !session.user) {
//       return Response.json(
//         {
//           success: false,
//           message: "Unauthorized",
//         },
//         {
//           status: 401,
//         }
//       );
//     }
//     const userId = new mongoose.Types.ObjectId(user._id);
//     const userMessages = await UserModel.aggregate([
//       { $match: { _id: userId } },
//       { $unwind: "$messages" },
//       {
//         $match: { "message.is_delete": { $ne: true } },
//       },
//       { $sort: { "messages.createdAt": -1 } },
//       { $group: { _id: "$_id", messages: { $push: "$messages" } } },
//     ]);
//     if (!userMessages || userMessages.length == 0) {
//       return Response.json(
//         {
//           success: false,
//           message: "User not found",
//         },
//         {
//           status: 404,
//         }
//       );
//     }
//     return Response.json(
//       {
//         success: true,
//         message: "Success",
//         result: userMessages[0].messages,
//       },
//       {
//         status: 200,
//       }
//     );
//   } catch (error) {
//     return Response.json(
//       {
//         success: false,
//         message: "Failed to updated",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }
