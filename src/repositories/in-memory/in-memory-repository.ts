import { Prisma, User } from ".prisma/client";
import { UsersRepository } from "../users-repository";

export class InMemoryRepository implements UsersRepository {
  public items: User[] = [];
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      id: "user-1",
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
      role: "ADMIN",
    };
    this.items.push(user);
    return user;
  }
  async findByEmail(
    email: Pick<Prisma.UserCreateInput, "email">
  ): Promise<User | null> {
    return this.items.find((user) => user.email === email.email) || null;
  }
  async findById({
    id,
  }: Pick<Prisma.UserCreateInput, "id">): Promise<User | null> {
    return this.items.find((user) => user.id === id) || null;
  }
}
