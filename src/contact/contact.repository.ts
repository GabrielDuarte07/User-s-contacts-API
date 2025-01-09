import { IContact, IContactRepository } from "../interfaces/contact.interface";
import { prisma } from "../utils/database";

class ContactRepository implements IContactRepository {
  async create({
    name,
    email,
    phone,
    user_id,
  }: Pick<IContact, "name" | "email" | "phone" | "user_id">): Promise<IContact> {
    const newContact = await prisma.contact.create({ data: { name, email, phone, user_id } });
    return newContact;
  }

  async findAllByUser(user_id: string): Promise<IContact[]> {
    const contacts = await prisma.contact.findMany({ where: { user_id } });
    return contacts;
  }

  async findByEmail(email: string): Promise<IContact | null> {
    const contact = await prisma.contact.findFirst({ where: { email } });
    return contact;
  }

  async findById(id: string): Promise<IContact | null> {
    const contact = await prisma.contact.findFirst({ where: { id } });
    return contact;
  }

  async remove(id: string): Promise<IContact> {
    const deleted = await prisma.contact.delete({ where: { id } });
    return deleted;
  }

  async update(
    id: string,
    { name, email, phone }: Pick<IContact, "email" | "name" | "phone">,
  ): Promise<IContact> {
    const updated = await prisma.contact.update({
      where: { id },
      data: {
        name,
        email,
        phone,
      },
    });

    return updated;
  }
}

export { ContactRepository };
