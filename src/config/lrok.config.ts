import * as fs from "fs";
import * as os from "os";
import * as path from "path";

/**
 * lrok tunnel configuration
 */
export const lrokConfig = {
  configDir: path.join(os.homedir(), ".lrok"),
  configFile: "config.toml",
  apiKeyPrefix: "lum_",
} as const;

export interface LrokSettings {
  apiKey?: string;
  subdomain?: string;
  enableBasicAuth?: boolean;
  basicAuthUser?: string;
  basicAuthPass?: string;
}

/**
 * Get the path to the lrok config file
 */
export function getConfigPath(): string {
  return path.join(lrokConfig.configDir, lrokConfig.configFile);
}

/**
 * Ensure the config directory exists
 */
export function ensureConfigDir(): void {
  if (!fs.existsSync(lrokConfig.configDir)) {
    fs.mkdirSync(lrokConfig.configDir, { recursive: true, mode: 0o700 });
  }
}

/**
 * Load API key from config file
 */
export function loadApiKey(): string | undefined {
  const configPath = getConfigPath();
  if (!fs.existsSync(configPath)) {
    return undefined;
  }

  try {
    const content = fs.readFileSync(configPath, "utf-8");
    // Simple TOML parsing for api_key
    const match = content.match(/api_key\s*=\s*"([^"]+)"/);
    return match ? match[1] : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Save API key to config file
 */
export function saveApiKey(apiKey: string): void {
  ensureConfigDir();
  const configPath = getConfigPath();
  
  // Write in TOML format matching lrok CLI
  const content = `[auth]
api_key = "${apiKey}"
`;
  fs.writeFileSync(configPath, content, { mode: 0o600 });
}

/**
 * Validate API key format
 */
export function validateApiKey(apiKey: string): boolean {
  return apiKey.startsWith(lrokConfig.apiKeyPrefix);
}
