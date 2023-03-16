import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime";
import { beforeEach, expect, describe, it, vi, afterEach } from "vitest";
import { CheckInUseCase } from "../check-in";
import { MaxDistanceError } from "../errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "../errors/max-number-of-check-ins-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    vi.useFakeTimers();

    await gymsRepository.create({
      id: "gym-01",
      title: "Title",
      description: "",
      latitude: -27.2092052,
      longitude: -49.6401091,
      phone: "",
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
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
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      });

    await newCheckIn();

    await expect(async () => await newCheckIn()).rejects.toBeInstanceOf(
      MaxNumberOfCheckInsError
    );
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date("2021-01-01T00:00:00.000Z"));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    const nextDay = "2021-01-02T00:00:00.000Z";

    vi.setSystemTime(new Date(nextDay));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    expect(checkIn).toEqual({
      created_at: new Date(nextDay),
      gym_id: expect.any(String),
      id: expect.any(String),
      user_id: expect.any(String),
      validated_at: null,
    });
  });

  it("should not be able to check in on distance gym", async () => {
    gymsRepository.items.push({
      id: "gym-2",
      title: "Title",
      description: "",
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
      phone: "",
    });

    await expect(async () => {
      await sut.execute({
        gymId: "gym-2",
        userId: "user-1",
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      });
    }).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
