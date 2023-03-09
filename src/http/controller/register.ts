import { registerUseCase } from "@/use-cases/register";
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

  try {
    await registerUseCase(registerBodyParsed);
    return reply.status(201).send();
  } catch (error) {
    if (error instanceof Error)
      return reply.status(409).send({ message: error.message });
    return reply.status(500).send({ message: "unknown" });
  }
};