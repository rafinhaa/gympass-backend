export class BaseError extends Error {
  statusCode: number;
  error: string;

  constructor(message: string, statusCode: number, error: string) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
  }
}
