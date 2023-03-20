import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CheckInUseCase } from "../check-in";

export const makeCheckInUseCase = () => {
  return new CheckInUseCase(
    new PrismaCheckInRepository(),
    new PrismaGymsRepository()
  );
};
