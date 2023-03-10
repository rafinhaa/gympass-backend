import { Prisma, User } from ".prisma/client";
import { UsersRepository } from "../prisma/users-repository";

export class InMemoryRepository implements UsersRepository {
  public items: User[] = [];
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: "user-1",
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };
    this.items.push(user);
    return user;
  }
  async findByEmail(
    email: Pick<Prisma.UserCreateInput, "email">
  ): Promise<User | null> {
    return this.items.find((user) => user.email === email.email) || null;
  }
}
