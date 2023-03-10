import { Prisma, User } from "@prisma/client";

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  findByEmail(
    email: Pick<Prisma.UserCreateInput, "email">
  ): Promise<User | null>;
}
