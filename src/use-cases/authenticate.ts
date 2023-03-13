import { UsersRepository } from "@/repositories/prisma/users-repository";
import { User } from "@prisma/client";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

interface AuthenticateUseCaseRequest {
  password: string;
  email: string;
}

interface AuthenticateUseCaseResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  execute = async ({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> => {
    const user = await this.usersRepository.findByEmail({ email });

    if (!user) throw new InvalidCredentialsError();

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) throw new InvalidCredentialsError();

    return { user };
  };
}
