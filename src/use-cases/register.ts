import { UsersRepository } from "@/repositories/prisma/users-repository";
import { hash } from "bcryptjs";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  execute = async ({ email, name, password }: RegisterUseCaseRequest) => {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail({ email });

    if (userWithSameEmail) throw new Error("E-mail already exists");

    await this.usersRepository.create({ email, password_hash, name });
  };
}
