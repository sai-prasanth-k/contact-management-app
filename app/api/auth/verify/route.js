import prisma from "@/lib/prisma";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { verified: true },
    });

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
}
