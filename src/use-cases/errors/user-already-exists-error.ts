import { BaseError } from "./base-error";

export class UserAlreadyExistsError extends BaseError {
  constructor() {
    super("User already exists", 409, "Conflict");
  }
}
