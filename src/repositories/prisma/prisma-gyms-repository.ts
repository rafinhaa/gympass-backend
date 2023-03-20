import { prisma } from "@/lib/prisma";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coodinates";
import { Gym, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { GymsRepository } from "../gyms-repository";

export class InMemoryGymsRepository implements GymsRepository {
  async findById(id: string): Promise<Gym | null> {
    return await prisma.gym.findUnique({
      where: { id },
    });
  }
  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    return await prisma.gym.create({
      data,
    });
  }
  async searchMany(query: string, page: number): Promise<Gym[]> {
    return await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });
  }
  async findManyNearBy({
    userLatitude,
    userLongitude: userLongitude,
  }: {
    userLatitude: number;
    userLongitude: number;
  }): Promise<Gym[]> {
    return await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${userLatitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${userLongitude}) ) + sin( radians(${userLatitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;
  }
}
