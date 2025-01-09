import { UserRepository } from "./user.repository";
import { IUser } from "../interfaces/user.interface";

class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser({ name, email }: Pick<IUser, "name" | "email">): Promise<IUser> {
    const userExists = await this.userRepository.findUserByEmail(email);

    if (userExists) {
      throw new Error("E-mail already exists");
    }

    const newUser = await this.userRepository.create({ name, email });

    return newUser;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findUserById(id);
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findUserByEmail(email);
    return user;
  }

  async updateUser(id: string, { name, email }: Pick<IUser, "name" | "email">): Promise<IUser> {
    const userExists = await this.userRepository.findUserById(id);

    if (!userExists) {
      throw new Error("User not found");
    }

    const checkEmail = await this.userRepository.findUserByEmail(email);

    if (checkEmail && checkEmail.id !== id) {
      throw new Error("E-mail already exists");
    }

    const updated = await this.userRepository.update(id, { name, email });

    return updated;
  }

  async deleteUser(id: string): Promise<IUser> {
    const userExists = await this.userRepository.findUserById(id);

    if (!userExists) {
      throw new Error("User not found");
    }

    const deleted = await this.userRepository.remove(id);

    return deleted;
  }
}

export { UserService };
