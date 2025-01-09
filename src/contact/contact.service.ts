import { ContactRepository } from "./contact.repository";
import { IContact } from "../interfaces/contact.interface";
import { UserRepository } from "../user/user.repository";

class ContactService {
  private contactRepository: ContactRepository;
  private userRepository: UserRepository;

  constructor() {
    this.contactRepository = new ContactRepository();
    this.userRepository = new UserRepository();
  }

  async createContact({
    name,
    email,
    phone,
    user_id,
  }: Pick<IContact, "name" | "email" | "phone" | "user_id">): Promise<IContact> {
    const contactExists = await this.contactRepository.findByEmail(email);

    if (contactExists) {
      throw new Error("E-mail already exists");
    }

    const userExists = await this.userRepository.findUserById(user_id);

    if (!userExists) {
      throw new Error("User not found");
    }

    const newContact = await this.contactRepository.create({ name, email, phone, user_id });
    return newContact;
  }

  async updateContact(
    id: string,
    { name, email, phone }: Pick<IContact, "email" | "name" | "phone">,
  ): Promise<IContact> {
    const contactExists = await this.contactRepository.findById(id);

    if (!contactExists) {
      throw new Error("Contact not found");
    }

    const contactEmail = await this.contactRepository.findByEmail(email);

    if (contactEmail && contactEmail.id !== id) {
      throw new Error("E-mail already exists");
    }

    const updated = await this.contactRepository.update(id, { name, email, phone });

    return updated;
  }

  async getContactByEmail(email: string) {
    const contact = await this.contactRepository.findByEmail(email);
    return contact;
  }

  async getContactById(id: string) {
    const contact = await this.contactRepository.findById(id);
    return contact;
  }

  async getContactsByUser(id: string) {
    const contacts = await this.contactRepository.findAllByUser(id);
    return contacts;
  }

  async deleteContact(id: string) {
    const contactExists = await this.contactRepository.findById(id);

    if (!contactExists) {
      throw new Error("Contact not found");
    }

    const deleted = await this.contactRepository.remove(id);
    return deleted;
  }
}

export { ContactService };
