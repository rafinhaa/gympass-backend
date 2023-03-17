import { CheckInsRepository } from "@/repositories/check-in-repository";
import { CheckIn } from "@prisma/client";

interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  execute = async ({
    userId,
    page,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> => {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page
    );

    return {
      checkIns,
    };
  };
}
