import autocannon from 'autocannon';
import { fork } from 'child_process';
import path from 'path';

const PORT = 4000; // Use a distinct port for testing
const HOST = `http://localhost:${PORT}`;

// Helper to sleep
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runBenchmark = async () => {
  console.log("========================================================");
  console.log("STARTING AUTOMATED QUESTLY LOAD TEST SUITE");
  console.log("========================================================\n");

  // 1. Start the backend server as a child process with mocked environment variables
  console.log(`Spinning up backend server on port ${PORT}...`);
  const serverPath = path.resolve('src/server.js');
  const serverProcess = fork(serverPath, [], {
    env: {
      ...process.env,
      PORT: PORT.toString(),
      MOCK_AUTH: 'true',
      MOCK_STREAM: 'true',
      NODE_ENV: 'test' // Prevents production client static hosting, keeping it clean
    },
    silent: true // Mute standard logs so it doesn't clutter benchmark output
  });

  // Log server stdout briefly to ensure it starts
  serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Server is running') || output.includes('Connected to DB')) {
      console.log(`[Server stdout] ${output.trim()}`);
    }
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[Server stderr] ${data.toString().trim()}`);
  });

  // Wait 5 seconds for database connection and server boot
  console.log("Waiting 5 seconds for Mongoose connection...");
  await sleep(5000);

  const results = {};

  try {
    // 2. Scenario 1: GET /health (Baseline HTTP Throughput)
    console.log("\n--------------------------------------------------------");
    console.log("SCENARIO 1: GET /health (Baseline Baseline HTTP)");
    console.log("--------------------------------------------------------");
    const healthResult = await autocannon({
      url: `${HOST}/health`,
      connections: 100,
      duration: 10,
      title: 'Health Check'
    });
    results.health = formatStats(healthResult);

    // 3. Scenario 2: GET /api/sessions/active (Database Read & Sorting Under Concurrency)
    console.log("\n--------------------------------------------------------");
    console.log("SCENARIO 2: GET /api/sessions/active (Database Read + Populate)");
    console.log("--------------------------------------------------------");
    const activeResult = await autocannon({
      url: `${HOST}/api/sessions/active`,
      connections: 100,
      duration: 10,
      title: 'Active Sessions',
      headers: {
        'x-mock-clerk-id': 'mock_clerk_host'
      }
    });
    results.active = formatStats(activeResult);

    // 4. Scenario 3: POST /api/sessions (Database Write + Mock Call Creation)
    console.log("\n--------------------------------------------------------");
    console.log("SCENARIO 3: POST /api/sessions (Database Write/Create)");
    console.log("--------------------------------------------------------");
    const createResult = await autocannon({
      url: `${HOST}/api/sessions`,
      connections: 50, // lower concurrency for heavy write endpoints
      duration: 10,
      title: 'Create Session',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-mock-clerk-id': 'mock_clerk_host'
      },
      body: JSON.stringify({
        problem: 'Two Sum Load Test',
        difficulty: 'easy'
      })
    });
    results.create = formatStats(createResult);

    // 5. Output beautiful Markdown table
    console.log("\n========================================================");
    console.log("BENCHMARK RESULTS SUMMARY (MARKDOWN FORMAT)");
    console.log("========================================================\n");
    console.log(generateMarkdownReport(results));

  } catch (error) {
    console.error("Benchmark execution error:", error);
  } finally {
    // 6. Gracefully kill the server process
    console.log("\nShutting down backend test server...");
    serverProcess.kill('SIGINT');
    await sleep(1000);
    console.log("Server shutdown complete. Benchmark finished!");
    process.exit(0);
  }
};

function formatStats(res) {
  return {
    title: res.title,
    reqSec: res.requests.average,
    latencyP50: res.latency.p50,
    latencyP90: res.latency.p90,
    latencyP99: res.latency.p99,
    throughput: (res.throughput.average / 1024 / 1024).toFixed(2), // MB/s
    totalErrors: res.errors + res.non2xx
  };
}

function generateMarkdownReport(results) {
  return `| Scenario | Req/Sec (Avg) | P50 Latency (ms) | P90 Latency (ms) | P99 Latency (ms) | Throughput | Errors (Non-2xx) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| **GET /health** (Baseline) | ${results.health.reqSec.toFixed(1)} | ${results.health.latencyP50} ms | ${results.health.latencyP90} ms | ${results.health.latencyP99} ms | ${results.health.throughput} MB/s | ${results.health.totalErrors} |
| **GET /api/sessions/active** (DB Read) | ${results.active.reqSec.toFixed(1)} | ${results.active.latencyP50} ms | ${results.active.latencyP90} ms | ${results.active.latencyP99} ms | ${results.active.throughput} MB/s | ${results.active.totalErrors} |
| **POST /api/sessions** (DB Write) | ${results.create.reqSec.toFixed(1)} | ${results.create.latencyP50} ms | ${results.create.latencyP90} ms | ${results.create.latencyP99} ms | ${results.create.throughput} MB/s | ${results.create.totalErrors} |`;
}

runBenchmark();
