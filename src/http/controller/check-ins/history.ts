import { makeFetchCheckInUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const history = async (request: FastifyRequest, reply: FastifyReply) => {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(request.query);

  const checkInHistoryUseCase = makeFetchCheckInUseCase();

  const { checkIns } = await checkInHistoryUseCase.execute({
    page,
    userId: request.user.sub,
  });
  return reply.status(200).send({ checkIns });
};
