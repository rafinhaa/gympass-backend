import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { ValidatedCheckInUseCase } from "../validate-check-in";

export const makeValidateCheckInUseCase = () => {
  return new ValidatedCheckInUseCase(new PrismaCheckInRepository());
};
