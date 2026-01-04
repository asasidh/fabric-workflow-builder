import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkFabricStatus, getPatterns } from './fabric';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Fabric Workflow Builder API');
});

app.get('/api/status', async (req, res) => {
  const status = await checkFabricStatus();
  res.json(status);
});

app.get('/api/patterns', async (req, res) => {
  const patterns = await getPatterns();
  res.json({ patterns });
});

interface Node {
  id: string;
  type?: string;
  data: {
    label?: string;
    text?: string;
    useClipboard?: boolean;
    [key: string]: any;
  };
}

interface Edge {
  source: string;
  target: string;
}

app.post('/api/execute', (req, res) => {
  const { workflow, input } = req.body;
  
  if (!workflow || !workflow.nodes) {
    return res.status(400).json({ error: 'Invalid workflow' });
  }

  const nodes: Node[] = workflow.nodes;
  const edges: Edge[] = workflow.edges || [];
  const results: Record<string, string> = {};
  
  // Topological Sort
  const adj = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  
  nodes.forEach(node => {
    adj.set(node.id, []);
    inDegree.set(node.id, 0);
  });
  
  edges.forEach(edge => {
    const sourceAdj = adj.get(edge.source);
    if (sourceAdj) {
      sourceAdj.push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    }
  });
  
  const queue = nodes.filter(node => inDegree.get(node.id) === 0).map(n => n.id);
  const executionOrder: string[] = [];
  
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    executionOrder.push(nodeId);
    
    adj.get(nodeId)?.forEach(neighbor => {
      inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    });
  }

  // Execute in order
  executionOrder.forEach(nodeId => {
    const node = nodes.find(n => n.id === nodeId)!;
    const incomingEdges = edges.filter(e => e.target === nodeId);
    const nodeInput = incomingEdges.length > 0 
      ? incomingEdges.map(e => results[e.source]).join('\n\n')
      : input;
      
    if (node.type === 'inputNode') {
       if (node.data.useClipboard) {
         results[nodeId] = "Mock Clipboard Content: [User's Clipboard Data]";
       } else {
         results[nodeId] = node.data.text || '';
       }
    } else if (node.type === 'endNode') {
        results[nodeId] = nodeInput;
    } else {
        // Pattern Node
        results[nodeId] = `Mock output for ${node.data.label}: Processing "${nodeInput ? nodeInput.substring(0, 30) + (nodeInput.length > 30 ? '...' : '') : ''}"`;
    }
  });

  res.json({ results });
});

export default app;