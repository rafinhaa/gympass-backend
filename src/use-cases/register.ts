import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

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

    if (userWithSameEmail) throw new UserAlreadyExistsError();

    const user = await this.usersRepository.create({
      email,
      password_hash,
      name,
    });
    return { user };
  };
}
