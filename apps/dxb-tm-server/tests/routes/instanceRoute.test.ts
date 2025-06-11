import { expect } from "chai";
import request from "supertest";
import expressApp from '../../src/index';

describe('GET /instance', () => {
    it('should return 404 for GET request', async () => {
        const res = await request(expressApp).get('/instance');
        expect(res.status).to.equal(404);
    })
})