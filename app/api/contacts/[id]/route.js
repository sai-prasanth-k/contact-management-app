import prisma from "@/lib/prisma";
import protect from "@/middleware/auth";

async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(contact);
  } else if (req.method === "PUT") {
    const { name, phoneNumber, address, timezone } = req.body;
    const contact = await prisma.contact.update({
      where: { id },
      data: { name, phoneNumber, address, timezone },
    });

    res.status(200).json(contact);
  } else if (req.method === "DELETE") {
    await prisma.contact.delete({ where: { id } });
    res.status(204).end();
  }
}


async function handler(req, res) {
  if (req.method === "PUT") {
    const { id } = req.query;
    const { name, email, phoneNumber, address, timezone } = req.body;

    try {
      const updatedContact = await prisma.contact.update({
        where: { id },
        data: { name, email, phoneNumber, address, timezone },
      });

      res.status(200).json(updatedContact);
    } catch (error) {
      res.status(400).json({ message: "Error updating contact", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


async function handler(req, res) {
  if (req.method === "PUT") {
    const { id } = req.query;
    const { name, email, phoneNumber, address, timezone } = req.body;

    try {
      const updatedContact = await prisma.contact.update({
        where: { id },
        data: { name, email, phoneNumber, address, timezone },
      });

      res.status(200).json(updatedContact);
    } catch (error) {
      res.status(400).json({ message: "Error updating contact", error: error.message });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    try {
      const deletedContact = await prisma.contact.update({
        where: { id },
        data: { deleted: true },
      });

      res.status(200).json(deletedContact);
    } catch (error) {
      res.status(400).json({ message: "Error deleting contact", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default protect(handler);
