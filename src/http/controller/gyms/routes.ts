import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middleware/verify-jwt";
import { BaseError } from "@/use-cases/errors/base-error";
import { search } from "./search";
import { nearby } from "./nearby";
import { create } from "./create";

export const gymsRoutes = async (app: FastifyInstance) => {
  app.addHook("onRequest", verifyJWT);

  app.get("/search", search);
  app.get("/nearby", nearby);
  app.post("/create", create);

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
