import { FastifyInstance } from "fastify";

import { authenticate } from "@/http/controller/users/authenticate";
import { profile } from "@/http/controller/users/profile";
import { register } from "@/http/controller/users/register";

import { BaseError } from "@/use-cases/errors/base-error";
import { verifyJWT } from "@/http/middleware/verify-jwt";

export const usersRoutes = async (app: FastifyInstance) => {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  app.get("/me", { preHandler: verifyJWT }, profile);

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
