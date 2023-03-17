import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
}

interface FetchNearbyUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  execute = async ({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyUseCaseResponse> => {
    const gyms = await this.gymsRepository.findManyNearBy({
      userLatitude,
      userLongitude,
    });

    return {
      gyms,
    };
  };
}
