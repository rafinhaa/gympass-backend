import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { SearchGymsUseCase } from "../search-gyms";

export const makeSearchGymsUseCase = () => {
  return new SearchGymsUseCase(new PrismaGymsRepository());
};
