import { CheckIn, Gym, Prisma } from ".prisma/client";
import { GymsRepository } from "../gyms-repository";

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findById(id: string): Promise<Gym | null> {
    return this.items.find((user) => user.id === id) || null;
  }
}
