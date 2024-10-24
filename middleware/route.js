import { verifyToken } from "@/lib/jwt";

export default function protect(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.userId = decodedToken.userId;
    return handler(req, res);
  };
}
