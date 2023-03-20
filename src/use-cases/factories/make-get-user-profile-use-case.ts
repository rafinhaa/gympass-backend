import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetUserProfileUseCase } from "../get-user-profile";

export const makeGetUserProfileUseCase = () => {
  return new GetUserProfileUseCase(new PrismaUsersRepository());
};
