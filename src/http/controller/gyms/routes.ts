import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middleware/verify-jwt";
import { BaseError } from "@/use-cases/errors/base-error";

export const gymsRoutes = async (app: FastifyInstance) => {
  app.addHook("onRequest", verifyJWT);

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
