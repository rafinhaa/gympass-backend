import { CheckInsRepository } from "@/repositories/check-in-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFound } from "./errors/resource-not-found";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  execute = async ({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> => {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) throw new ResourceNotFound();

    //TODO: calculate distance between user and gym

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDay) throw new Error();

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return { checkIn };
  };
}
