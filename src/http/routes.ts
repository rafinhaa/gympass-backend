import { BaseError } from "@/use-cases/errors/base-error";
import { FastifyInstance } from "fastify";
import { authenticate } from "./controller/authenticate";
import { register } from "./controller/register";

export const appRoutes = async (app: FastifyInstance) => {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  app.setErrorHandler((error, _, reply) => {
    if (error instanceof BaseError)
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.error,
        message: error.message,
      });

    throw error;
  });
};
