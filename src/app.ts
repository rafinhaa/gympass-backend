import fastify from "fastify";
import { env } from "@/env";

import { ZodError } from "zod";
import fastifyJwt from "@fastify/jwt";
import { usersRoutes } from "@/http/controller/users/routes";
import { gymsRoutes } from "@/http/controller/gyms/routes";

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

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(gymsRoutes);
app.register(usersRoutes);

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
