import { spawn } from 'child_process';
import os from 'os';
import path from 'path';

let cachedPath: string | null = null;

export const getFabricPath = async (): Promise<string | null> => {
  if (cachedPath) return cachedPath;

  // Try PATH
  const pathCheck = await checkCommand('fabric');
  if (pathCheck.available) {
    cachedPath = 'fabric';
    return 'fabric';
  }

  // Try Go Path
  const goPath = path.join(os.homedir(), 'go', 'bin', 'fabric');
  const goCheck = await checkCommand(goPath);
  if (goCheck.available) {
    cachedPath = goPath;
    return goPath;
  }

  return null;
};

export const checkFabricStatus = async (): Promise<{ available: boolean; version?: string; binaryPath?: string }> => {
  const binary = await getFabricPath();
  if (!binary) return { available: false };
  const res = await checkCommand(binary);
  return { ...res, binaryPath: binary };
};

const checkCommand = (cmd: string): Promise<{ available: boolean; version?: string }> => {
  return new Promise((resolve) => {
    const process = spawn(cmd, ['--version']);
    let output = '';
    let resolved = false;

    const timeout = setTimeout(() => {
        if (!resolved) {
            process.kill();
            resolve({ available: false });
            resolved = true;
        }
    }, 2000);

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.on('error', () => {
        if (!resolved) {
            clearTimeout(timeout);
            resolve({ available: false });
            resolved = true;
        }
    });

    process.on('close', (code) => {
        if (!resolved) {
            clearTimeout(timeout);
            if (code === 0) {
                resolve({ available: true, version: output.trim() });
            } else {
                resolve({ available: false });
            }
            resolved = true;
        }
    });
  });
};