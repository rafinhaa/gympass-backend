import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { FetchNearbyGymsUseCase } from "../fetch-nearby-gyms";

export const makeFetchNearbyGymsUseCase = () => {
  return new FetchNearbyGymsUseCase(new PrismaGymsRepository());
};
