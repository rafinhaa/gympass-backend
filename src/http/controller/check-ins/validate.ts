import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-user-case";
import { makeValidateCheckInUseCase } from "@/use-cases/factories/make-validate-check-in-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const validate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const validateCheckInQuerySchema = z.object({
    checkInId: z.string().uuid(),
  });

  const checkInId = validateCheckInQuerySchema.parse(request.params);

  const createCheckInUseCase = makeValidateCheckInUseCase();

  await createCheckInUseCase.execute(checkInId);
  return reply.status(204).send();
};
