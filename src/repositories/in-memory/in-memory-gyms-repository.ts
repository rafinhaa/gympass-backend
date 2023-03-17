import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coodinates";
import { Gym, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { GymsRepository } from "../gyms-repository";

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findById(id: string): Promise<Gym | null> {
    return this.items.find((user) => user.id === id) || null;
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      phone: data.phone,
    };
    this.items.push(gym);
    return gym;
  }
  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }
  async findManyNearBy({
    userLatitude,
    userLongitude,
  }: {
    userLatitude: number;
    userLongitude: number;
  }): Promise<Gym[]> {
    return this.items.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: userLatitude, longitude: userLongitude },
        { latitude: Number(gym.latitude), longitude: Number(gym.longitude) }
      );
      return distance <= 10;
    });
  }
}
