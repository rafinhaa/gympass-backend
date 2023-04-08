import { CheckInsRepository } from "@/repositories/check-in-repository";
import { CheckIn } from "@prisma/client";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";
import { ResourceNotFound } from "./errors/resource-not-found";

interface ValidatedCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidatedCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidatedCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  execute = async ({
    checkInId,
  }: ValidatedCheckInUseCaseRequest): Promise<ValidatedCheckInUseCaseResponse> => {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) throw new ResourceNotFound();

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minutes"
    );

    if (distanceInMinutesFromCheckInCreation > 20)
      throw new LateCheckInValidationError();

    const checkInValidated: CheckIn = {
      ...checkIn,
      validated_at: new Date(),
    };

    await this.checkInsRepository.save(checkInValidated);

    return { checkIn: checkInValidated };
  };
}
