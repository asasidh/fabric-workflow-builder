import request from 'supertest';
import app from './app';

describe('GET /', () => {
  it('responds with Fabric Workflow Builder API', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Fabric Workflow Builder API');
  });
});
