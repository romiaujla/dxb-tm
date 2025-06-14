import { expect } from "chai";
import type { UserModel } from "dxb-tm-core";
import request from "supertest";
import { App } from "../../src/app";
import { ObjectDeleteTypeEnum } from "../../src/enums/object-delete-type.enum";
import { getRandomString } from "./utility/utility.functions";

const app = new App().getServer();
let userId: number | undefined;

describe("User Routes /user", () => {
  describe("POST /", () => {
    it("should return 200 and the posted data for POST request", async () => {
      const email: UserModel["email"] = `test+${getRandomString()}@dxbtm.com`;
      const firstName: UserModel["firstName"] = getRandomString();
      const middleName: UserModel["firstName"] = getRandomString();
      const lastName: UserModel["firstName"] = getRandomString();
      const password: UserModel["firstName"] = getRandomString(20);

      const data: Pick<
        UserModel,
        "email" | "firstName" | "lastName" | "middleName" | "password"
      > = {
        email,
        firstName,
        middleName,
        lastName,
        password,
      };

      const { status, body } = await request(app).post("/user").send(data);

      expect(status).to.equal(200);
      expect(body.id).to.not.be.undefined;

      userId = body.id;

      expect(body.email).to.equal(data.email);
      expect(body.firstName).to.equal(data.firstName);
      expect(body.middleName).to.equal(data.middleName);
      expect(body.lastName).to.equal(data.lastName);
      expect(body.password).to.equal(data.password);
      expect(body.active).to.equal(true);
    });

    it("should return 400 for invalid email", async () => {
      const data: Pick<
        UserModel,
        "email" | "firstName" | "lastName" | "middleName" | "password"
      > = {
        email: "invalid-email",
        firstName: getRandomString(),
        lastName: getRandomString(),
        middleName: getRandomString(),
        password: getRandomString(),
      };

      const { status, body } = await request(app).post("/user").send(data);

      expect(status).to.equal(400);
      expect(body.message).to.equal("'email' is not a valid email");
    });
  });

  describe("GET /:id", () => {
    it("should return 200 and the posted data for GET request", async () => {
      const { status, body } = await request(app).get(`/user/${userId}`);

      expect(status).to.equal(200);
      expect(body.id).to.equal(userId);
    });
  });

  describe("PATCH /:id", () => {
    it("should return 200 and the updated data for PATCH request", async () => {
      const email: UserModel["email"] = `test+${getRandomString()}@dxbtm.com`;

      const { status, body } = await request(app)
        .patch(`/user/${userId}`)
        .send({
          email,
        });

      expect(status).to.equal(200);
      expect(body.email).to.equal(email);
    });
  });

  describe("DELETE /:id", () => {
    it("should soft delete the record if the deletion type is not provided", async () => {
      const {
        status,
        body: { body },
      } = await request(app).delete(`/user/${userId}`);

      expect(status).to.equal(200);
      expect(body.deleted).to.equal(true);
      expect(body.type).to.equal(ObjectDeleteTypeEnum.SOFT);
    });

    it("should hard delete the record if the deletion type is provided", async () => {
      const email: UserModel["email"] = `test+${getRandomString()}@dxbtm.com`;
      const firstName: UserModel["firstName"] = getRandomString();
      const middleName: UserModel["firstName"] = getRandomString();
      const lastName: UserModel["firstName"] = getRandomString();
      const password: UserModel["firstName"] = getRandomString(20);

      const data: Pick<
        UserModel,
        "email" | "firstName" | "lastName" | "middleName" | "password"
      > = {
        email,
        firstName,
        middleName,
        lastName,
        password,
      };

      const postResponse = await request(app).post("/user").send(data);

      expect(postResponse.body.id).to.not.be.undefined;
      userId = postResponse.body.id;

      const {
        status,
        body: { body },
      } = await request(app)
        .delete(`/user/${userId}`)
        .send({ deleteType: ObjectDeleteTypeEnum.HARD });

      expect(status).to.equal(200);
      expect(body.deleted).to.equal(true);
      expect(body.type).to.equal(ObjectDeleteTypeEnum.HARD);
    });
  });
});
