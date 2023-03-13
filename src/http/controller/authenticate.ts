import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const authenticationBodyParsed = authenticateBodySchema.parse(request.body);

  const authenticateUseCase = makeAuthenticateUseCase();

  await authenticateUseCase.execute(authenticationBodyParsed);
  return reply.status(200).send();
};
