import { BaseError } from "./base-error";

export class InvalidCredentialsError extends BaseError {
  constructor() {
    super("Invalid credentials", 401, "Unauthorized");
  }
}
