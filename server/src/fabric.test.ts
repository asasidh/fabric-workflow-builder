import { checkFabricStatus } from './fabric';
import { spawn } from 'child_process';
import { EventEmitter } from 'events';

jest.mock('child_process');

describe('checkFabricStatus', () => {
  it('returns available: true and version when fabric is found', async () => {
    const mockProcess = new EventEmitter() as any;
    mockProcess.stdout = new EventEmitter();
    (spawn as jest.Mock).mockReturnValue(mockProcess);

    const promise = checkFabricStatus();

    mockProcess.stdout.emit('data', 'fabric 1.0.0\n');
    mockProcess.emit('close', 0);

    const result = await promise;
    expect(result).toEqual({ available: true, version: 'fabric 1.0.0' });
  });

  it('returns available: false when fabric is not found (error)', async () => {
    const mockProcess = new EventEmitter() as any;
    mockProcess.stdout = new EventEmitter();
    (spawn as jest.Mock).mockReturnValue(mockProcess);

    const promise = checkFabricStatus();

    mockProcess.emit('error', new Error('Command not found'));

    const result = await promise;
    expect(result).toEqual({ available: false });
  });
});
