import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";

const emailQuerySchema = z.object({
  email: z.string().email(),
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      email: searchParams.get("email"),
    };

    const result = emailQuerySchema.safeParse(queryParam);
    console.log(result, "check uniqeu email  18");
    if (!result.success) {
      const emailErrors = result.error.format().email?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            emailErrors?.length > 0
              ? emailErrors.join(",")
              : "Invalid query parameter or invalid email",
        },
        {
          status: 400,
        }
      );
    }
    const { email } = result.data;
    const user = await UserModel.findOne({ email:decodeURIComponent(email) });
    if (user) {
      return Response.json(
        {
          success: false,
          message: "Email Id already exists",
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Valid Email Id",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error while checking unique email", error);
    return Response.json(
      {
        success: false,
        message: "Error matching email",
      },
      {
        status: 500,
      }
    );
  }
}
