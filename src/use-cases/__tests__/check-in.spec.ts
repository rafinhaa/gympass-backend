import { CheckInsRepository } from "@/repositories/check-in-repository";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, expect, describe, it } from "vitest";
import { CheckInUseCase } from "../check-in";

let checkInsRepository: CheckInsRepository;
let sut: CheckInUseCase;

describe("Check In Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInsRepository);
  });

  it("should be able check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
    });

    expect(checkIn).toEqual({
      created_at: expect.any(Date),
      gym_id: expect.any(String),
      id: expect.any(String),
      user_id: expect.any(String),
      validated_at: null,
    });
  });
});
