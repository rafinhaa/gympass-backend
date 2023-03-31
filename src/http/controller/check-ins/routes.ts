import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middleware/verify-jwt";
import { BaseError } from "@/use-cases/errors/base-error";
import { create } from "./create";
import { metrics } from "./metrics";
import { history } from "./history";
import { validate } from "./validate";
import { verifyUserRole } from "@/http/middleware/verify-user-role";

export const checkInsRoutes = async (app: FastifyInstance) => {
  app.addHook("onRequest", verifyJWT);

  app.get("/history", history);
  app.get("/metrics", metrics);

  app.post("/gyms/:gymId/create", create);
  app.patch(
    "/:checkInId/validate",
    { onRequest: [verifyUserRole("ADMIN")] },
    validate
  );

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
