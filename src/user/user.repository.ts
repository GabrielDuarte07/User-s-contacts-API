import { IUser, IUserRepository } from "../interfaces/user.interface";
import { prisma } from "../utils/database";
import { z } from "zod";

class UserRepository implements IUserRepository {
  async create({ name, email }: Pick<IUser, "name" | "email">): Promise<IUser> {
    const newUser = await prisma.user.create({ data: { name, email } });
    return newUser;
  }

  async findAll(): Promise<IUser[]> {
    const users = await prisma.user.findMany();
    return users;
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    const user = await prisma.user.findFirst({ where: { email } });
    return user;
  }

  async findUserById(id: string): Promise<IUser | null> {
    const user = await prisma.user.findFirst({ where: { id } });
    return user;
  }

  async update(id: string, { name, email }: Pick<IUser, "name" | "email">): Promise<IUser> {
    const user = await prisma.user.update({ where: { id }, data: { name, email } });
    return user;
  }

  async remove(id: string): Promise<IUser> {
    const user = await prisma.user.delete({ where: { id } });
    return user;
  }
}

export { UserRepository };
