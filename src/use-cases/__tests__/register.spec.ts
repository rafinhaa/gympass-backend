import { InMemoryRepository } from "@/repositories/in-memory/in-memory-repository";
import { compare } from "bcryptjs";
import { expect, describe, it } from "vitest";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";
import { RegisterUseCase } from "../register";

describe("Register Use Case", () => {
  it("should be able to register new user", async () => {
    const usersRepository = new InMemoryRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user).toEqual(expect.any(Object));
  });

  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with an existing email", async () => {
    const usersRepository = new InMemoryRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = "johndoe@example.com";

    const registerUser = async () =>
      await registerUseCase.execute({
        name: "John Doe",
        email,
        password: "123456",
      });

    await registerUser();

    expect(async () => await registerUser()).rejects.toBeInstanceOf(
      UserAlreadyExistsError
    );
  });
});
