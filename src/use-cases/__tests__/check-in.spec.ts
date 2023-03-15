import { CheckInsRepository } from "@/repositories/check-in-repository";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, expect, describe, it, vi, afterEach } from "vitest";
import { CheckInUseCase } from "../check-in";

let checkInsRepository: CheckInsRepository;
let sut: CheckInUseCase;

describe("Check In Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date("2021-01-01T00:00:00.000Z"));

    const newCheckIn = async () =>
      await sut.execute({
        gymId: "gym-1",
        userId: "user-1",
      });

    await newCheckIn();

    await expect(async () => await newCheckIn()).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date("2021-01-01T00:00:00.000Z"));

    await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
    });

    const nextDay = "2021-01-02T00:00:00.000Z";

    vi.setSystemTime(new Date(nextDay));

    const { checkIn } = await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
    });

    expect(checkIn).toEqual({
      created_at: new Date(nextDay),
      gym_id: expect.any(String),
      id: expect.any(String),
      user_id: expect.any(String),
      validated_at: null,
    });
  });
});
