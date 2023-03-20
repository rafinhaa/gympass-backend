import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { FetchUserCheckInsHistoryUseCase } from "../fetch-user-check-ins-history";

export const makeFetchCheckInUseCase = () => {
  return new FetchUserCheckInsHistoryUseCase(new PrismaCheckInRepository());
};
