import { CheckIn, Prisma } from ".prisma/client";
import dayjs from "dayjs";
import { randomUUID } from "node:crypto";
import { CheckInsRepository } from "../check-in-repository";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };
    this.items.push(checkIn);
    return checkIn;
  }
  async findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");
    return (
      this.items.find((checkIn) => {
        const checkInDate = dayjs(checkIn.created_at);
        const isOnSameDate =
          checkInDate.isAfter(startOfTheDay) &&
          checkInDate.isBefore(endOfTheDay);
        return checkIn.user_id === userId && isOnSameDate;
      }) || null
    );
  }
  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.items
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20);
  }
  async countByUserId(userId: string): Promise<number> {
    return this.items.filter((checkIn) => checkIn.user_id === userId).length;
  }
  async findById(id: string): Promise<CheckIn | null> {
    return this.items.find((checkIn) => checkIn.id === id) || null;
  }
  async save(data: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.items.findIndex((checkIn) => {
      return checkIn.id === data.id;
    });

    console.log(this.items[checkInIndex]);

    if (checkInIndex >= 0) this.items[checkInIndex] = data;
    return data;
  }
}
