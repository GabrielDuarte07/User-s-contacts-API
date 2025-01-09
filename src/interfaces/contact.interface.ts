export interface IContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
}

export interface IContactRepository {
  create({
    name,
    email,
    phone,
    user_id,
  }: Pick<IContact, "name" | "email" | "phone" | "user_id">): Promise<IContact>;
  findAllByUser(user_id: string): Promise<IContact[]>;
  findByEmail(email: string): Promise<IContact | null>;
  findById(id: string): Promise<IContact | null>;
  remove(id: string): Promise<IContact>;
  update(
    id: string,
    { name, email, phone }: Partial<Pick<IContact, "email" | "name" | "phone">>,
  ): Promise<IContact>;
}
