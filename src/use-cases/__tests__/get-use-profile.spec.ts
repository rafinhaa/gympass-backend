import { InMemoryRepository } from "@/repositories/in-memory/in-memory-repository";
import { hash } from "bcryptjs";
import { beforeEach, expect, describe, it } from "vitest";
import { GetUserProfileUseCase } from "../get-user-profile";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";
import { ResourceNotFound } from "../errors/resource-not-found";

let usersRepository: InMemoryRepository;
let sut: GetUserProfileUseCase;

describe("Get use profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to get user profile", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user).toEqual({
      ...createdUser,
      id: expect.any(String),
      created_at: expect.any(Date),
      password_hash: expect.any(String),
    });
  });

  it("should not be able to get user profile", async () => {
    expect(
      async () =>
        await sut.execute({
          userId: "non-existing-id",
        })
    ).rejects.toBeInstanceOf(ResourceNotFound);
  });
});
