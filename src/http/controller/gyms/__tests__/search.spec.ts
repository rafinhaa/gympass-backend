import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import request from "supertest";
import { createAndAuthenticateUsers } from "../../__tests__/create-and-authenticate-users";

describe("Search Gyms E2E", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("should be able to search an gym", async () => {
    const { token } = await createAndAuthenticateUsers(app);

    await request(app.server)
      .post("/gyms/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym 1",
        description: "any description",
        phone: "1199999999",
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    await request(app.server)
      .post("/gyms/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym 2",
        description: "any description",
        phone: "1199999999",
        latitude: -27.0610928,
        longitude: -49.5229501,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .set("Authorization", `Bearer ${token}`)
      .query({ query: "Gym 2" })
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ id: expect.any(String) }),
    ]);
  });
});
