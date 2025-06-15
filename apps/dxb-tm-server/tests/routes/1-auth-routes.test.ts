import { expect } from "chai";
import request from "supertest";
import { App } from "../../src/app";
import { getTestUser } from "./utility/utility.functions";

const app = new App().getServer();

describe("Test user routes /test-user", () => {
    describe("POST /", () => {
        it("should return 200 and the posted data for POST request", async () => {
            const { status: getStatus } =
                await request(app).get("/test-user/1");

            if (getStatus !== 200) {
                const data = getTestUser();

                const { status } = await request(app)
                    .post("/test-user")
                    .send(data);

                expect(status).to.equal(200);
            }
        });
    });

    describe("GET /:id", () => {
        it("should return 200 and the posted data for GET request", async () => {
            const { status } = await request(app).get("/test-user/1");
            expect(status).to.equal(200);
        });
    });

    describe("Auth routes /auth", () => {
        describe("POST /login", () => {
            it("should return 200 and the posted data for POST request", async () => {
                const data = getTestUser();

                const { status, body } = await request(app)
                    .post("/auth/login")
                    .send(data);

                expect(status).to.equal(200);
                expect(body.data.accessToken).to.not.be.undefined;
                expect(body.data.refreshToken).to.not.be.undefined;
            });
        });
    });
});
