import { InMemoryRepository } from "@/repositories/in-memory/in-memory-repository";
import { compare, hash } from "bcryptjs";
import { expect, describe, it } from "vitest";
import { AuthenticateUseCase } from "../authenticate";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";

describe("Register Use Case", () => {
  it("should be able authenticate", async () => {
    const usersRepository = new InMemoryRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await authenticateUseCase.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user).toEqual({
      id: "user-1",
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: expect.any(String),
      created_at: expect.any(Date),
    });
  });

  it("should not be able authenticate with wrong email", async () => {
    const usersRepository = new InMemoryRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

    expect(
      async () =>
        await authenticateUseCase.execute({
          email: "johndoe@example.com",
          password: "123456",
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able authenticate with wrong password", async () => {
    const usersRepository = new InMemoryRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    expect(
      async () =>
        await authenticateUseCase.execute({
          email: "johndoe@example.com",
          password: "000000",
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
