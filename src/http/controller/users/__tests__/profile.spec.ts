import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import request from "supertest";
import { createAndAuthenticateUsers } from "../../__tests__/create-and-authenticate-users";

const USER_EMAIL = "johndoe@example.com";

describe("Profile E2E", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("should be able to get user profile", async () => {
    const { token } = await createAndAuthenticateUsers(app);

    const response = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      user: expect.objectContaining({ email: USER_EMAIL }),
    });
  });
});
