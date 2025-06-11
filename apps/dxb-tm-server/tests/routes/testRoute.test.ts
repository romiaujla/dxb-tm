import { expect } from 'chai';
import { it } from 'mocha';
import request from 'supertest';
import { App } from '../../src/app';

const expressApp = new App().getServer();

describe('GET /test', () => {
    it('should return 200 and "Server is running!"', async () => {
        const res = await request(expressApp).get('/test');
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('Server is running!');
    });

    it('should return 404 for an unknown route', async () => {
        const res = await request(expressApp).get('/unknown-route');
        expect(res.status).to.equal(404);
    });
});