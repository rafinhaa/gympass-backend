import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, expect, describe, it, vi, afterEach } from "vitest";
import { LateCheckInValidationError } from "../errors/late-check-in-validation-error";
import { ResourceNotFound } from "../errors/resource-not-found";
import { ValidatedCheckInUseCase } from "../validate-check-in";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidatedCheckInUseCase;

describe("Validate check in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidatedCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able validate check in", async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkIn: validateCheckIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(validateCheckIn).toEqual({
      created_at: expect.any(Date),
      gym_id: expect.any(String),
      id: expect.any(String),
      user_id: expect.any(String),
      validated_at: expect.any(Date),
    });
  });

  it("should not be able validate an inexistent check-in", async () => {
    await expect(
      async () =>
        await sut.execute({
          checkInId: "inexistent check in",
        })
    ).rejects.toBeInstanceOf(ResourceNotFound);
  });

  it("should not be able validate the check in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const afterTwentyMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(afterTwentyMinutesInMs);

    await expect(
      async () =>
        await sut.execute({
          checkInId: createdCheckIn.id,
        })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
