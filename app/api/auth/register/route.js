import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import jwt from 'jsonwebtoken';
import transporter from "@/lib/mailer";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const { email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      hashedPassword,
      verified: false,
    },
  });

  const verificationToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  const verificationUrl = `http://localhost:3000/api/auth/verify?token=${verificationToken}`;

  await transporter.sendMail({
    to: user.email,
    subject: 'Verify your email address',
    text: `Verify your email by clicking this link: ${verificationUrl}`,
  });

  res.status(201).json({ message: "User registered successfully. Check your email for verification." });
}
