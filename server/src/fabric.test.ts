import { checkFabricStatus, _resetCache } from './fabric';
import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import os from 'os';

jest.mock('child_process');
jest.mock('os');

// Mock fetch globally for Jest
(global as any).fetch = jest.fn();

describe('checkFabricStatus', () => {
  let processes: any[] = [];

  beforeEach(() => {
    _resetCache();
    processes = [];
    (os.homedir as jest.Mock).mockReturnValue('/mock/home');
    (spawn as jest.Mock).mockClear();
    (global.fetch as jest.Mock).mockReset();
    // Default: API not available
    (global.fetch as jest.Mock).mockResolvedValue({ status: 404 });

    (spawn as jest.Mock).mockImplementation(() => {
        const proc = new EventEmitter() as any;
        proc.stdout = new EventEmitter();
        proc.kill = jest.fn();
        processes.push(proc);
        return proc;
    });
  });

  it('returns available: true and version when fabric is found in PATH', async () => {
    const promise = checkFabricStatus();

    // Give it a bit of time to reach the first spawn
    for (let i = 0; i < 50; i++) {
        if (processes.length > 0) break;
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    // Process 0 (PATH check) - Success
    processes[0].stdout.emit('data', 'fabric 1.0.0\n');
    processes[0].emit('close', 0);
    
    // Wait for the final check call
    for (let i = 0; i < 50; i++) {
        if (processes.length > 1) break;
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    // Process 1 (Final check) - Success
    processes[1].stdout.emit('data', 'fabric 1.0.0\n');
    processes[1].emit('close', 0);

    const result = await promise;
    expect(result).toEqual({ available: true, version: 'fabric 1.0.0', binaryPath: 'fabric', apiAvailable: false });
  });

  it('returns available: true and version when fabric is found in Go path', async () => {
    const promise = checkFabricStatus();

    // Process 0 (PATH check) - Fail
    for (let i = 0; i < 50; i++) {
        if (processes.length > 0) break;
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    processes[0].emit('error', new Error('Not found'));
    
    // Process 1 (Go Path check) - Success
    for (let i = 0; i < 50; i++) {
        if (processes.length > 1) break;
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    processes[1].stdout.emit('data', 'fabric 1.0.0\n');
    processes[1].emit('close', 0);
    
    // Process 2 (Final check) - Success
    for (let i = 0; i < 50; i++) {
        if (processes.length > 2) break;
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    processes[2].stdout.emit('data', 'fabric 1.0.0\n');
    processes[2].emit('close', 0);

    const result = await promise;
    expect(result.available).toBe(true);
    expect(result.binaryPath).toContain('/mock/home/go/bin/fabric');
  });

  it('returns available: true when REST API is found', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ status: 200 });

    const result = await checkFabricStatus();
    expect(result.available).toBe(true);
    expect(result.apiAvailable).toBe(true);
    expect(result.version).toContain('REST API Active');
    expect(spawn).not.toHaveBeenCalled();
  });
});
