import request from 'supertest';
import app from './app';

describe('GET /', () => {
  it('responds with Fabric Workflow Builder API', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Fabric Workflow Builder API');
  });
});

describe('POST /api/execute', () => {
  it('executes a simple single-node workflow', async () => {
    const workflow = {
      nodes: [
        { id: '1', data: { label: 'Summarize' } }
      ],
      edges: []
    };
    const response = await request(app)
      .post('/api/execute')
      .send({ workflow, input: 'Hello world' });
    
    expect(response.status).toBe(200);
    expect(response.body.results['1']).toContain('Mock output for Summarize');
  });
});
