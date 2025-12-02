import { execSync } from "node:child_process";
import net from "node:net";

export async function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(true)); // Port is still in use
    server.once("listening", () => {
      server.close(() => resolve(false)); // Port is free
    });
    server.listen(port);
  });
}

/**
 * Attempt to kill any process using the specified port.
 * This is best-effort and silently ignores failures.
 * @param port - The port number to free up
 */
export function killProcessOnPort(port: number) {
  try {
    if (process.platform === "win32") {
      // Windows: Find and kill process using netstat and taskkill
      // Suppress stdio to avoid noisy output when no process exists
      execSync(
        `FOR /F "tokens=5" %a in ('netstat -ano ^| findstr :${port}') do taskkill /F /PID %a`,
        { stdio: 'ignore' }
      );
    } else {
      // Unix: Find and kill process using lsof
      // Redirect stderr to /dev/null and suppress stdio for cleaner output
      execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null`, { stdio: 'ignore' });
    }
  } catch {
    // Expected when no process is using the port - silently ignore
    // Debug logging could be added here if troubleshooting is needed
  }
}
