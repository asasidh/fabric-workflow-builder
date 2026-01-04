import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import { constants } from 'fs';

let cachedPath: string | null = null;
let debugLogs: string[] = [];

const log = (msg: string) => {
  const m = `[${new Date().toISOString()}] ${msg}`;
  debugLogs.push(m);
  console.log(m);
  if (debugLogs.length > 100) debugLogs.shift();
};

export const getDebugLogs = () => debugLogs;

export const _resetCache = () => {
  cachedPath = null;
};

const checkCommand = async (cmd: string): Promise<{ available: boolean; version?: string }> => {
  try {
    const isAbsolute = path.isAbsolute(cmd);
    if (isAbsolute) {
      await fs.access(cmd, constants.X_OK);
      log(`Path confirmed executable: ${cmd}`);
      // If it's an absolute path and we can execute it, we're good. 
      // Skipping --version check to avoid hangs during discovery.
      return { available: true, version: 'verified' };
    }
    
    // For non-absolute (like just 'fabric'), we need to check if it's in PATH
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

      process.stdout.on('data', (data) => output += data.toString());
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
          resolve({ available: code === 0, version: output.trim() });
          resolved = true;
        }
      });
    });
  } catch (e: any) {
    return { available: false };
  }
};

export const getFabricPath = async (): Promise<string | null> => {
  if (cachedPath) return cachedPath;

  log('Starting Fabric path discovery...');

  // 1. Try Go Path (Known location on this system)
  const homeDir = os.homedir();
  const goPath = path.join(homeDir, 'go', 'bin', 'fabric');
  const goCheck = await checkCommand(goPath);
  if (goCheck.available) {
    log(`Success: Found at ${goPath}`);
    cachedPath = goPath;
    return goPath;
  }

  // 2. Try common Linux/Mac path
  const localBinPath = '/usr/local/bin/fabric';
  const localCheck = await checkCommand(localBinPath);
  if (localCheck.available) {
    log(`Success: Found at ${localBinPath}`);
    cachedPath = localBinPath;
    return localBinPath;
  }

  // 3. Try PATH
  const pathCheck = await checkCommand('fabric');
  if (pathCheck.available) {
    log('Success: Found fabric in system PATH');
    cachedPath = 'fabric';
    return 'fabric';
  }

  log('Discovery failed: Fabric binary not found in expected locations.');
  return null;
};

export const checkApiStatus = async (): Promise<{ available: boolean }> => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1000);
    const response = await fetch('http://localhost:8080/patterns/names', { signal: controller.signal });
    clearTimeout(id);
    return { available: response.status === 200 };
  } catch (error) {
    return { available: false };
  }
};

export const checkFabricStatus = async (): Promise<{ available: boolean; version?: string; binaryPath?: string; apiAvailable?: boolean }> => {
  const apiStatus = await checkApiStatus();
  const binary = await getFabricPath();
  
  if (apiStatus.available) {
    return { available: true, version: 'REST API Active (port 8080)', apiAvailable: true, binaryPath: binary || undefined };
  }

  if (binary) {
    return { available: true, binaryPath: binary, apiAvailable: false };
  }

  return { available: false };
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
      log(`API patterns fetch failed: ${error}`);
    }
  }

  const binary = await getFabricPath();
  if (!binary) return [];
  
  return new Promise((resolve) => {
    const process = spawn(binary, ['--listpatterns']);
    let output = '';
    process.stdout.on('data', (data) => output += data.toString());
    process.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim().split('\n').filter(p => p && !p.includes('Patterns:')));
      } else {
        resolve([]);
      }
    });
  });
};

export const applyPattern = async (patternName: string, input: string): Promise<string> => {
  const apiStatus = await checkApiStatus();
  
  // Attempt API first
  if (apiStatus.available) {
    try {
      log(`[Fabric API] Sending request for pattern: ${patternName}`);
      const response = await fetch(`http://localhost:8080/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pattern: patternName, message: input }),
      });
      if (response.ok) {
        const text = await response.text();
        if (text.trim()) {
           log(`[Fabric API] Success: ${text.length} chars received.`);
           return text;
        }
        log('[Fabric API] Received empty response body.');
      } else {
        log(`[Fabric API] Server returned error: ${response.status}`);
      }
    } catch (error: any) {
      log(`[Fabric API] Error during request: ${error.message}`);
    }
    log('[Fabric API] Falling back to CLI execution.');
  }

  const binary = await getFabricPath();
  if (!binary) {
    throw new Error('Fabric binary not found. Please ensure fabric is installed at ~/go/bin/fabric or in your PATH.');
  }

  log(`[Fabric CLI] Executing: ${binary} -p ${patternName}`);
  return new Promise((resolve, reject) => {
    // Increased timeout for LLM processing
    const process = spawn(binary, ['-p', patternName]);
    let output = '';
    let errorOutput = '';

    process.stdin.write(input);
    process.stdin.end();

    process.stdout.on('data', (data) => output += data.toString());
    process.stderr.on('data', (data) => errorOutput += data.toString());

    process.on('close', (code) => {
      if (code === 0) {
        log(`[Fabric CLI] Success: ${output.length} chars received.`);
        resolve(output.trim());
      } else {
        log(`[Fabric CLI] Failed with code ${code}. Error: ${errorOutput}`);
        reject(new Error(`Fabric CLI failed: ${errorOutput}`));
      }
    });
  });
};

export const getPatternDescription = async (patternName: string): Promise<string> => {
  const homeDir = os.homedir();
  const patternDir = path.join(homeDir, '.config', 'fabric', 'patterns', patternName);
  
  try {
    const systemPath = path.join(patternDir, 'system.md');
    try {
      return await fs.readFile(systemPath, 'utf-8');
    } catch {
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