import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { FastifyInstance } from "fastify";
import { register } from "./controller/register";

export const appRoutes = async (app: FastifyInstance) => {
  app.post("/users", register);

  app.setErrorHandler((error, _, reply) => {
    if (error instanceof UserAlreadyExistsError)
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.error,
        message: error.message,
      });

    throw error;
  });
};
