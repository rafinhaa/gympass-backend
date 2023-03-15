import { CheckIn, Prisma } from ".prisma/client";
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
    return (
      this.items.find(
        (checkIn) =>
          checkIn.user_id === userId &&
          checkIn.created_at.getDate() === date.getDate()
      ) || null
    );
  }
}
