import { spawn } from 'child_process';

export const checkFabricStatus = (): Promise<{ available: boolean; version?: string }> => {
  return new Promise((resolve) => {
    const process = spawn('fabric', ['--version']);
    let output = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.on('error', () => {
      resolve({ available: false });
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve({ available: true, version: output.trim() });
      } else {
        resolve({ available: false });
      }
    });
  });
};
