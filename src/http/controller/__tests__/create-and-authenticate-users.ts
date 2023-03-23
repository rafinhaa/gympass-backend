import { FastifyInstance } from "fastify";
import request from "supertest";

const USER_EMAIL = "johndoe@example.com";

export const createAndAuthenticateUsers = async (app: FastifyInstance) => {
  await request(app.server).post("/users").send({
    name: "John doe",
    email: USER_EMAIL,
    password: "123456",
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email: USER_EMAIL,
    password: "123456",
  });

  const { token } = authResponse.body;

  return { token };
};
