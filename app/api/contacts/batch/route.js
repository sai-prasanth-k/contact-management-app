import prisma from "@/lib/prisma";
import protect from "@/middleware/auth";

async function handler(req, res) {
  if (req.method === "POST") {
    const { contacts } = req.body;

    if (!contacts || !Array.isArray(contacts)) {
      return res.status(400).json({ message: "Invalid request format" });
    }

    const results = [];

    for (const contact of contacts) {
      const { id, name, email, phoneNumber, address, timezone } = contact;

      try {
        let result;

        if (id) {
          // Update existing contact
          result = await prisma.contact.update({
            where: { id },
            data: { name, email, phoneNumber, address, timezone },
          });
        } else {
          // Create new contact
          result = await prisma.contact.create({
            data: { name, email, phoneNumber, address, timezone, authorId: req.userId },
          });
        }

        results.push(result);
      } catch (error) {
        results.push({ error: error.message });
      }
    }

    res.status(200).json(results);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default protect(handler);
