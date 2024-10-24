import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const { email, otp, newPassword } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Verify OTP
  if (user.otp !== otp || new Date() > new Date(user.otpExpires)) {
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update user password and clear OTP fields
  await prisma.user.update({
    where: { email },
    data: { hashedPassword, otp: null, otpExpires: null },
  });

  res.status(200).json({ message: "Password reset successfully." });
}
