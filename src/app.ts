import fastify from "fastify";
import { env } from "@/env";
import { appRoutes } from "./http/routes";

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
