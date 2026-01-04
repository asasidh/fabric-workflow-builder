import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';

let cachedPath: string | null = null;

export const _resetCache = () => {
  cachedPath = null;
};

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

export const checkApiStatus = async (): Promise<{ available: boolean }> => {
  try {
    // Fabric REST API identification: listing patterns should return 200
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000);
    const response = await fetch('http://localhost:8080/patterns/names', { signal: controller.signal });
    clearTimeout(id);
    return { available: response.status === 200 };
  } catch (error) {
    return { available: false };
  }
};

export const checkFabricStatus = async (): Promise<{ available: boolean; version?: string; binaryPath?: string; apiAvailable?: boolean }> => {
  // Check API first
  const apiStatus = await checkApiStatus();
  if (apiStatus.available) {
    return { available: true, version: 'REST API Active (port 8080)', apiAvailable: true };
  }

  const binary = await getFabricPath();
  if (!binary) return { available: false };
  const res = await checkCommand(binary);
  return { ...res, binaryPath: binary, apiAvailable: false };
};

export const getPatterns = async (): Promise<string[]> => {
  const apiStatus = await checkApiStatus();
  if (apiStatus.available) {
    try {
      const response = await fetch('http://localhost:8080/patterns/names');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to fetch patterns from API:', error);
    }
  }

  // Fallback to CLI
  const binary = await getFabricPath();
  if (!binary) return [];
  
  return new Promise((resolve) => {
    const process = spawn(binary, ['--list']);
    let output = '';
    process.stdout.on('data', (data) => output += data.toString());
    process.on('close', (code) => {
      if (code === 0) {
        // Parse CLI output (usually lines)
        resolve(output.trim().split('\n').filter(p => p && !p.includes('Patterns:')));
      } else {
        resolve([]);
      }
    });
  });
};

export const applyPattern = async (patternName: string, input: string): Promise<string> => {
  const apiStatus = await checkApiStatus();
  if (apiStatus.available) {
    try {
      const response = await fetch(`http://localhost:8080/patterns/${patternName}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      console.error(`Failed to apply pattern ${patternName} via API:`, error);
    }
  }

  // Fallback to CLI
  const binary = await getFabricPath();
  if (!binary) throw new Error('Fabric binary not found for execution');

  return new Promise((resolve, reject) => {
    const process = spawn(binary, ['-p', patternName]);
    let output = '';
    let errorOutput = '';

    process.stdin.write(input);
    process.stdin.end();

    process.stdout.on('data', (data) => output += data.toString());
    process.stderr.on('data', (data) => errorOutput += data.toString());

    process.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`Fabric CLI failed with code ${code}: ${errorOutput}`));
      }
    });
  });
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

    

    export const getPatternDescription = async (patternName: string): Promise<string> => {

      const homeDir = os.homedir();

      const patternDir = path.join(homeDir, '.config', 'fabric', 'patterns', patternName);

      

      try {

        // Try system.md first

        const systemPath = path.join(patternDir, 'system.md');

        try {

            return await fs.readFile(systemPath, 'utf-8');

        } catch {

            // Try README.md

            const readmePath = path.join(patternDir, 'README.md');

            return await fs.readFile(readmePath, 'utf-8');

        }

            } catch (e) {

                 return 'No description available.';

            }

          };

      

          export const savePattern = async (name: string, content: string): Promise<void> => {

            const homeDir = os.homedir();

            const patternDir = path.join(homeDir, '.config', 'fabric', 'patterns', name);

            const systemPath = path.join(patternDir, 'system.md');

      

            await fs.mkdir(patternDir, { recursive: true });

            await fs.writeFile(systemPath, content, 'utf-8');

          };

      

    