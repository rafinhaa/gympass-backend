import { InMemoryRepository } from "@/repositories/in-memory/in-memory-repository";
import { hash } from "bcryptjs";
import { beforeEach, expect, describe, it } from "vitest";
import { AuthenticateUseCase } from "../authenticate";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";

let usersRepository: InMemoryRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able authenticate", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user).toEqual({
      id: "user-1",
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: expect.any(String),
      created_at: expect.any(Date),
      role: "ADMIN",
    });
  });

  it("should not be able authenticate with wrong email", async () => {
    expect(
      async () =>
        await sut.execute({
          email: "johndoe@example.com",
          password: "123456",
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    expect(
      async () =>
        await sut.execute({
          email: "johndoe@example.com",
          password: "000000",
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
