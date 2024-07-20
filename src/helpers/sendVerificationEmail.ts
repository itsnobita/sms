import { resend } from "@/lib/resend";
import VerificationEmail from "../../templates/verificationEmail";
import { apiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email: string,
    name: string,
    verify_code: string
  ): Promise<apiResponse> {
    try {
      await resend.emails.send({
        from: 'Secret Message Sender <onboarding@resend.dev>',
        to: email,
        subject: 'Secret Message Sender Verification Code',
        react: VerificationEmail({ name, verify_code }),
      });
      return {success:true, message: 'Verification email sent successfully.' };
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      return { success: false, message: 'Failed to send verification email.' };
    }
  }