import { expect } from 'chai';
import type { UserModel } from "dxb-tm-core";
import request from 'supertest';
import { App } from "../../src/app";
import { getRandomString } from "./utility/utility.functions";

const app = new App().getServer();
let userId: number | undefined;

describe('User Routes /user', () => {
    describe('POST /', () => {
        it('should return 200 and the posted data for POST request', async () => {
            const email: UserModel['email'] = `test+${getRandomString()}@dxbtm.com`;
            const firstName: UserModel['firstName'] = getRandomString();
            const middleName: UserModel['firstName'] = getRandomString();
            const lastName: UserModel['firstName'] = getRandomString();
            const password: UserModel['firstName'] = getRandomString();

            const data: Pick<UserModel, 'email' | 'firstName' | 'lastName' | 'middleName' | 'password'> = {
                email,
                firstName,
                middleName,
                lastName,
                password
            }

            const { status, body } = await request(app).post('/instance').send(data);

            expect(status).to.equal(200);
            expect(body.id).to.not.be.undefined;

            userId = body.id;
            console.log('userId', userId);

            expect(body.email).to.equal(data.email);
            expect(body.firstName).to.equal(data.firstName);
            expect(body.middleName).to.equal(data.middleName);
            expect(body.lastName).to.equal(data.lastName);
            expect(body.password).to.equal(data.password);
        });
    })
})