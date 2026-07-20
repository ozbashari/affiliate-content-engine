import fs from 'fs';
import path from 'path';

// Helper to load environment variables from file if they are not already defined
function loadEnvFile(fileName: string): void {
  try {
    const envPath = path.join(process.cwd(), fileName);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        // Skip empty lines and comments
        if (!trimmed || trimmed.startsWith('#')) {
          continue;
        }
        const index = trimmed.indexOf('=');
        if (index > -1) {
          const key = trimmed.slice(0, index).trim();
          const val = trimmed.slice(index + 1).trim();
          // Remove surrounding quotes (single or double)
          const cleanVal = val.replace(/^["']|["']$/g, '');
          if (process.env[key] === undefined) {
            process.env[key] = cleanVal;
          }
        }
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn(`Warning: Failed to load ${fileName}:`, errorMessage);
  }
}

// Load environment configurations
loadEnvFile('.env.local');
loadEnvFile('.env');

// Validate numeric environment variables
function parseNumericEnv(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (value === undefined || value === '') {
    return defaultValue;
  }
  const parsed = Number(value);
  if (isNaN(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
    console.error(`Error: Environment variable ${key} must be a valid positive integer. Received: "${value}"`);
    process.exit(1);
  }
  return parsed;
}

const PORT = parseNumericEnv('PORT', 3000);
if (PORT < 1 || PORT > 65535) {
  console.error(`Error: PORT must be between 1 and 65535. Received: ${PORT}`);
  process.exit(1);
}

const LOCAL_CRON_INTERVAL_MINUTES = parseNumericEnv('LOCAL_CRON_INTERVAL_MINUTES', 15);
const LOCAL_CRON_TIMEOUT_SECONDS = parseNumericEnv('LOCAL_CRON_TIMEOUT_SECONDS', 120);

const CRON_SECRET = process.env.CRON_SECRET;

if (!CRON_SECRET) {
  console.error('Error: CRON_SECRET is not defined in environment or env files.');
  process.exit(1);
}

function getTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

let isRunning = false;

async function runJob(): Promise<void> {
  const timestamp = getTimestamp();
  console.log(`[${timestamp}]`);

  if (isRunning) {
    console.log('Skipping run because the previous execution is still active.\n');
    return;
  }

  isRunning = true;
  console.log('Running local automation...');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, LOCAL_CRON_TIMEOUT_SECONDS * 1000);

  try {
    const url = `http://localhost:${PORT}/api/cron/publish`;
    const start = performance.now();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
      },
      signal: controller.signal,
    });
    
    // Clear timeout as request completed
    clearTimeout(timeoutId);
    
    const duration = Math.round(performance.now() - start);
    const statusText = response.statusText || (response.status === 200 ? 'OK' : '');
    console.log(`${response.status} ${statusText}`);
    console.log(`Execution time: ${duration}ms`);

    let responseText = '';
    try {
      responseText = await response.text();
      const json = JSON.parse(responseText);
      console.log('Response JSON:', JSON.stringify(json, null, 2));
    } catch {
      console.log('Response JSON (Parsing failed, raw text):', responseText);
    }
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`Error: Request timed out after ${LOCAL_CRON_TIMEOUT_SECONDS} seconds.`);
    } else {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error: Request failed:', errorMessage);
    }
  } finally {
    isRunning = false;
  }
  console.log(''); // Empty line spacer
}

// Run immediately on start
runJob();

// Set interval
const INTERVAL_MS = LOCAL_CRON_INTERVAL_MINUTES * 60 * 1000;
const intervalId = setInterval(runJob, INTERVAL_MS);

const cleanup = (): void => {
  console.log('\nStopping local automation...');
  clearInterval(intervalId);
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
