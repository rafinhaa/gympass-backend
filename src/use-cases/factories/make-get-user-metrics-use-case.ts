import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { GetUserMetricsUseCase } from "../get-user-metrics";

export const makeGetUserMetricsUseCase = () => {
  return new GetUserMetricsUseCase(new PrismaCheckInRepository());
};
