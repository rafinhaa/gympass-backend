import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "../authenticate";

export const makeAuthenticateUseCase = () => {
  return new AuthenticateUseCase(new PrismaUsersRepository());
};
