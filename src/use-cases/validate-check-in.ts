import { CheckInsRepository } from "@/repositories/check-in-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coodinates";
import { CheckIn } from "@prisma/client";
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

    const checkInValidated: CheckIn = {
      ...checkIn,
      validated_at: new Date(),
    };

    await this.checkInsRepository.save(checkInValidated);

    return { checkIn: checkInValidated };
  };
}
