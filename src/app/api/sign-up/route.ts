import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { getShortURL } from "@/helpers/getShortUrl";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, password, username = "", name } = await request.json();
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return Response.json(
        {
          success: true,
          message: "Email already registered",
        },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let verify_code = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await UserModel.create({
      email:email.toString().toLowerCase(),
      password: hashedPassword,
      username,
      name,
      messages: [],
      verify_code,
      actual_password: password,
    });
    let short_url;
    try {
      short_url = await getShortURL(user?._id as string, user.name);
    } catch (e) {
      short_url=`${process.env.BASEURL}/${user._id}`
      console.log("Error getting short url");
    }
    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        short_url: short_url,
      }
    );
    // const emailResponse=await sendVerificationEmail(email, name, verify_code)
    // if (!emailResponse.success) {
    //     return Response.json(
    //       {
    //         success: false,
    //         message: emailResponse.message,
    //       },
    //       { status: 500 }
    //     );
    //   }

    return Response.json(
      {
        success: true,
        message: "User registered successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      {
        succsess: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
