import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, expect, describe, it, vi, afterEach } from "vitest";
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
});
