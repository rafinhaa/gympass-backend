import fastify from "fastify";
import { env } from "@/env";
import { appRoutes } from "./http/routes";
import { ZodError } from "zod";

const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: false,
  test: true,
};

export const app = fastify({
  logger: envToLogger[env.NODE_ENV],
});

app.register(appRoutes);

app.setErrorHandler((error, _, reply) => {
  if (env.NODE_ENV !== "production") console.log(error);

  if (error instanceof ZodError)
    return reply.status(400).send({
      statusCode: 400,
      error: "Validation error",
      message: error.format(),
    });

  reply.status(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: "Ocorreu um erro interno",
  });
});
