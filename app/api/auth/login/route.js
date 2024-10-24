import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { createToken } from "@/lib/jwt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isValidPassword = await verifyPassword(password, user.hashedPassword);

  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = createToken(user);

  res.status(200).json({ token });
}
