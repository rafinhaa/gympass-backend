import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import request from "supertest";
import { createAndAuthenticateUsers } from "../../__tests__/create-and-authenticate-users";
import { prisma } from "@/lib/prisma";

describe("Validate Check-in E2E", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("should be able to validate check-in", async () => {
    const { token } = await createAndAuthenticateUsers(app, true);

    const gym = await prisma.gym.create({
      data: {
        title: "Javascript Gym",
        phone: "11999999999",
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    });

    const response = await request(app.server)
      .post(`/check-ins/gyms/${gym.id}/create`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    expect(response.statusCode).toEqual(201);
  });
});
