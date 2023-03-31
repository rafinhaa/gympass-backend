import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { FastifyReply, FastifyRequest } from "fastify";

export const verifyUserRole = (roleToVerify: "ADMIN" | "MEMBER") => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { role } = request.user;
      console.log(request.user);
      if (role !== roleToVerify) throw new InvalidCredentialsError();
    } catch (error) {
      throw error;
    }
  };
};
