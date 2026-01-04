import { checkFabricStatus, _resetCache, applyPattern } from './fabric';
import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import os from 'os';

jest.mock('child_process');
jest.mock('os');

// Mock fetch globally for Jest
(global as any).fetch = jest.fn();

describe('fabric module', () => {
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
        proc.stderr = new EventEmitter();
        proc.stdin = { write: jest.fn(), end: jest.fn() };
        proc.kill = jest.fn();
        processes.push(proc);
        return proc;
    });
  });

  const waitForProcess = async (index: number) => {
    for (let i = 0; i < 50; i++) {
        if (processes.length > index) return;
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    throw new Error(`Process ${index} not spawned`);
  };

  describe('checkFabricStatus', () => {
    it('returns available: true and version when fabric is found in PATH', async () => {
      const promise = checkFabricStatus();

      await waitForProcess(0);
      processes[0].stdout.emit('data', 'fabric 1.0.0\n');
      processes[0].emit('close', 0);
      
      await waitForProcess(1);
      processes[1].stdout.emit('data', 'fabric 1.0.0\n');
      processes[1].emit('close', 0);

      const result = await promise;
      expect(result).toEqual({ available: true, version: 'fabric 1.0.0', binaryPath: 'fabric', apiAvailable: false });
    });
  });

  describe('applyPattern', () => {
    it('applies pattern via REST API when available', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 200,
        ok: true,
        text: () => Promise.resolve('API Output'),
      });

      const result = await applyPattern('test-pattern', 'hello');
      expect(result).toBe('API Output');
    });

    it('applies pattern via CLI when API is unavailable', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ status: 404 });
      
      const promise = applyPattern('test-pattern', 'hello');
      
      // 1. getFabricPath -> checkCommand('fabric')
      await waitForProcess(0);
      processes[0].stdout.emit('data', 'v1.0\n');
      processes[0].emit('close', 0);

      // 2. applyPattern -> spawn(binary, ['-p', ...])
      await waitForProcess(1);
      processes[1].stdout.emit('data', 'CLI Output');
      processes[1].emit('close', 0);

      const result = await promise;
      expect(result).toBe('CLI Output');
    });
  });
});
