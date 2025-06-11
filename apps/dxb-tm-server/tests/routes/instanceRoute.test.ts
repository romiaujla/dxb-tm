import { expect } from "chai";
import request from "supertest";
import { App } from "../../src/app";

const expressApp = new App().getServer();

describe('GET /instances', () => {
    it('should return 200 and a success message for GET request', async () => {
        const res = await request(expressApp).get('/instances');
        console.log('Response:', res.body);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ message: 'GET /instances - Working' });
    });
});

describe('POST /instances', () => {
    it('should return 200 and the posted data for POST request', async () => {
        const postData = { name: 'Test Instance', type: 'Type A' };
        const res = await request(expressApp).post('/instances').send(postData);
        console.log('Response:', res.body);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ message: 'POST /instances - Working', data: postData });
    });
});