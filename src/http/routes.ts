import { FastifyInstance } from "fastify";

import { authenticate } from "./controller/authenticate";
import { profile } from "./controller/profile";
import { register } from "./controller/register";

import { BaseError } from "@/use-cases/errors/base-error";

export const appRoutes = async (app: FastifyInstance) => {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  app.get("/me", profile);

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
