import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUseCase } from "../register";

export const makeRegisterUseCase = () => {
  return new RegisterUseCase(new PrismaUsersRepository());
};
