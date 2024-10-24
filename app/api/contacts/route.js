import prisma from "@/lib/prisma";
import protect from "@/middleware/auth";

async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, phoneNumber, address, timezone } = req.body;

    try {
      const newContact = await prisma.contact.create({
        data: {
          name,
          email,
          phoneNumber,
          address,
          timezone,
          author: { connect: { id: req.userId } },
        },
      });

      res.status(201).json(newContact);
    } catch (error) {
      res.status(400).json({ message: "Error creating contact", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, phoneNumber, address, timezone } = req.body;

    try {
      const newContact = await prisma.contact.create({
        data: {
          name,
          email,
          phoneNumber,
          address,
          timezone,
          author: { connect: { id: req.userId } },
        },
      });

      res.status(201).json(newContact);
    } catch (error) {
      res.status(400).json({ message: "Error creating contact", error: error.message });
    }
  } else if (req.method === "GET") {
    const { name, email, timezone, sort } = req.query;

    const filters = {};

    if (name) filters.name = { contains: name, mode: 'insensitive' };
    if (email) filters.email = { contains: email, mode: 'insensitive' };
    if (timezone) filters.timezone = { contains: timezone, mode: 'insensitive' };

    try {
      const contacts = await prisma.contact.findMany({
        where: {
          authorId: req.userId,
          ...filters,
        },
        orderBy: {
          [sort]: 'asc', // Default sorting by the specified field in ascending order
        },
      });

      res.status(200).json(contacts);
    } catch (error) {
      res.status(400).json({ message: "Error retrieving contacts", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default protect(handler);
