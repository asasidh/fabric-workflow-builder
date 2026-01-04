import request from 'supertest';
import app from './app';

jest.setTimeout(10000);

describe('GET /', () => {
  it('responds with Fabric Workflow Builder API', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Fabric Workflow Builder API');
  });
});

describe('GET /api/status', () => {
  it('returns fabric status', async () => {
    const response = await request(app).get('/api/status');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('available');
  });
});

describe('GET /api/patterns', () => {
  it('returns a list of patterns', async () => {
    const response = await request(app).get('/api/patterns');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('patterns');
    expect(Array.isArray(response.body.patterns)).toBe(true);
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

  it('executes a workflow with InputNode and EndNode', async () => {
    const workflow = {
      nodes: [
        { id: '1', type: 'inputNode', data: { text: 'Custom Input' } },
        { id: '2', type: 'endNode', data: {} }
      ],
      edges: [
        { source: '1', target: '2' }
      ]
    };
    const response = await request(app)
      .post('/api/execute')
      .send({ workflow });
    
    expect(response.status).toBe(200);
    expect(response.body.results['1']).toBe('Custom Input');
    expect(response.body.results['2']).toBe('Custom Input');
  });
});
