import request from 'supertest';
import app from './app';
import * as fabric from './fabric';

jest.mock('./fabric');
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
    (fabric.checkFabricStatus as jest.Mock).mockResolvedValue({ available: true });
    const response = await request(app).get('/api/status');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('available', true);
  });
});

describe('GET /api/patterns', () => {
  it('returns a list of patterns', async () => {
    (fabric.getPatterns as jest.Mock).mockResolvedValue(['p1', 'p2']);
    const response = await request(app).get('/api/patterns');
    expect(response.status).toBe(200);
    expect(response.body.patterns).toEqual(['p1', 'p2']);
  });
});

describe('GET /api/patterns/:name', () => {
  it('returns pattern description', async () => {
    (fabric.getPatternDescription as jest.Mock).mockResolvedValue('# Pattern Description');
    const response = await request(app).get('/api/patterns/Summarize');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Summarize');
    expect(response.body).toHaveProperty('description', '# Pattern Description');
  });
});

describe('POST /api/patterns', () => {
  it('saves a new pattern', async () => {
    (fabric.savePattern as jest.Mock).mockResolvedValue(undefined);
    const response = await request(app)
      .post('/api/patterns')
      .send({ name: 'new_pattern', content: 'new content' });
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Pattern saved successfully');
    expect(fabric.savePattern).toHaveBeenCalledWith('new_pattern', 'new content');
  });

  it('returns 400 if name or content missing', async () => {
    const response = await request(app)
      .post('/api/patterns')
      .send({ name: 'new_pattern' });
    
    expect(response.status).toBe(400);
  });
});

describe('POST /api/execute', () => {
  it('executes a simple single-node workflow', async () => {
    (fabric.applyPattern as jest.Mock).mockResolvedValue('Fabric Result');
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
    expect(response.body.results['1']).toBe('Fabric Result');
    expect(response.body.inputs['1']).toBe('Hello world');
    expect(fabric.applyPattern).toHaveBeenCalledWith('Summarize', 'Hello world');
  });
});
