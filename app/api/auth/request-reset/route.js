import prisma from "@/lib/prisma";
import { generateOTP, sendOTPEmail } from "@/lib/mailer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 10); // OTP expires in 10 minutes

    // Save OTP to user record
    await prisma.user.update({
      where: { email },
      data: { otp, otpExpires: expiration },
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email." });
  }
}
