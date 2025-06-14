import { expect } from "chai";
import { type InstanceModel } from "dxb-tm-core";
import request from "supertest";
import { App } from "../../src/app";

const app = new App().getServer();
let instanceId: number | undefined;

describe("Instance routes /instance", () => {
  describe("POST /", () => {
    it("should return 200 and the posted data for POST request", async () => {
      const data: Pick<InstanceModel, "name" | "alias" | "description"> = {
        name: "Test Instance",
        alias: "test_instance",
        description: "test description",
      };

      const { status, body } = await request(app).post("/instance").send(data);

      expect(status).to.equal(200);
      expect(body.id).to.not.be.undefined;

      instanceId = body.id;

      expect(body.name).to.equal(data.name);
      expect(body.alias).to.equal(data.alias);
      expect(body.description).to.equal(data.description);
      expect(body.active).to.equal(true);
    });

    /**
     * Can be further expanding on testing errors that can be thrown by the POST
     */
  });

  describe("GET /all", () => {
    it("should return 200 and a list of instances", async () => {
      const { status, body } = await request(app)
        .get("/instance/all")
        .set("Accept", "application/json");

      expect(status).to.equal(200);
      expect(body).to.be.an("array");

      const hasId = body.some((instance: InstanceModel) => {
        return instance.id === instanceId;
      });

      expect(hasId).to.equal(true);
    });
  });

  describe("GET /:id", () => {
    it("should return 200 and get the instance by id", async () => {
      const { status, body } = await request(app)
        .get(`/instance/${instanceId}`)
        .set("Accept", "application/json");

      expect(status).to.equal(200);
      expect(body).to.haveOwnProperty("id");
      expect(body.id).to.equal(instanceId);
    });
  });

  describe("DELETE /:id", () => {
    it("should soft delete the record if the deletion type is not provided", async () => {
      const {
        status,
        body: { body },
      } = await request(app).delete(`/instance/${instanceId}`);

      expect(status).to.equal(200);
      expect(body.deleted).to.equal(true);
      expect(body.type).to.equal("soft");
    });
  });
});
