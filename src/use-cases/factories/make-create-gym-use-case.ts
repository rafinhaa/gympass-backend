import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CreateGymUseCase } from "../create-gym";

export const createGymUseCase = () => {
  return new CreateGymUseCase(new PrismaGymsRepository());
};
