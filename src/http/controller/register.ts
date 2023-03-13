import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const registerBodyParsed = registerBodySchema.parse(request.body);

  const registerUseCase = makeRegisterUseCase();

  await registerUseCase.execute(registerBodyParsed);
  return reply.status(201).send();
};
