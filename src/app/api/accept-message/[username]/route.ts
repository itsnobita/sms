import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import { User } from "next-auth";


export async function GET(request: Request, { params }: { params: { username: string } }) {
  await dbConnect();
  try {
  
    const foundUser = await UserModel.findById({ _id: params.username });
    if (!foundUser) {
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
    return Response.json(
      {
        success: true,
        message: "Success",
        is_accepting_message: foundUser.is_accepting_message,
        name:foundUser.name
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
