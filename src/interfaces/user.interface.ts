export interface IUser {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export interface IUserRepository {
  create({ name, email }: Pick<IUser, "name" | "email">): Promise<IUser>;
  findUserByEmail(email: string): Promise<IUser | null>;
  findUserById(id: string): Promise<IUser | null>;
  remove(id: string): Promise<IUser>;
}
