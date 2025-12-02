#!/usr/bin/env node
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { program } from "commander";

import { appConfig } from "@/config/app.config";
import { saveApiKey, loadApiKey, validateApiKey } from "@/config/lrok.config";
import { debugLog } from "@/utils/log";

import type { Resource } from "@/resources/resource";
import { createServerWithTools } from "@/server";
import * as common from "@/tools/common";
import * as custom from "@/tools/custom";
import * as snapshot from "@/tools/snapshot";
import type { Tool } from "@/tools/tool";

import packageJSON from "../package.json";

interface ProgramOptions {
  apiKey?: string;
  tunnel?: boolean;
  subdomain?: string;
}

function setupExitWatchdog(server: Server) {
  process.stdin.on("close", async () => {
    setTimeout(() => process.exit(0), 15000);
    await server.close();
    process.exit(0);
  });
}

const commonTools: Tool[] = [common.pressKey, common.wait];

const customTools: Tool[] = [custom.getConsoleLogs, custom.screenshot];

const snapshotTools: Tool[] = [
  common.navigate(true),
  common.goBack(true),
  common.goForward(true),
  snapshot.snapshot,
  snapshot.click,
  snapshot.hover,
  snapshot.type,
  snapshot.selectOption,
  ...commonTools,
  ...customTools,
];

const resources: Resource[] = [];

async function createServer(): Promise<Server> {
  return createServerWithTools({
    name: appConfig.name,
    version: packageJSON.version,
    tools: snapshotTools,
    resources,
  });
}

/**
 * Get API key from environment variables
 * Supports LUM_API_KEY and legacy FRP_API_KEY for backward compatibility
 */
function getApiKeyFromEnv(): string | undefined {
  return process.env.LUM_API_KEY || process.env.FRP_API_KEY;
}

/**
 * Get API key from options, environment, or config file
 */
function getApiKey(options: ProgramOptions): string | undefined {
  // Priority: CLI option > environment variable > config file
  if (options.apiKey) {
    return options.apiKey;
  }
  
  const envKey = getApiKeyFromEnv();
  if (envKey) {
    return envKey;
  }
  
  return loadApiKey();
}

/**
 * Get API key with its source for display purposes
 */
function getApiKeyWithSource(): { key: string | undefined; source: string } {
  const envKey = getApiKeyFromEnv();
  if (envKey) {
    return { key: envKey, source: "environment variable" };
  }
  
  const configKey = loadApiKey();
  if (configKey) {
    return { key: configKey, source: "config file (~/.lrok/config.toml)" };
  }
  
  return { key: undefined, source: "" };
}

/**
 * Note: Tools must be defined *before* calling `createServer` because only declarations are hoisted, not the initializations
 */
program
  .version("Version " + packageJSON.version)
  .name(packageJSON.name)
  .description(appConfig.description)
  .option("-k, --api-key <key>", "lum.tools platform API key (or set LUM_API_KEY env var)")
  .option("-t, --tunnel", "Expose MCP server via lrok tunnel (requires API key)")
  .option("-s, --subdomain <name>", "Custom subdomain for tunnel (optional)")
  .action(async (options: ProgramOptions) => {
    // Handle API key
    const apiKey = getApiKey(options);
    
    if (options.tunnel) {
      if (!apiKey) {
        debugLog(`
❌ No API key configured!

You need a lum.tools platform API key to use tunnel mode.

📝 Get your API key:
   1. Visit: ${appConfig.keysUrl}
   2. Login with your account
   3. Create a new API key
   4. Copy your API key (starts with 'lum_')

💡 Usage:
   ${packageJSON.name} --api-key lum_your_api_key_here --tunnel

Or use environment variable:
   export LUM_API_KEY='lum_your_api_key_here'
   ${packageJSON.name} --tunnel
`);
        process.exit(1);
      }
      
      if (!validateApiKey(apiKey)) {
        debugLog("⚠️  Warning: API key should start with 'lum_'");
        debugLog(`   Get a valid key from: ${appConfig.keysUrl}`);
      }
      
      // Save API key for future use
      saveApiKey(apiKey);
      
      debugLog("🌐 Tunnel mode enabled");
      debugLog(`   API Key: ${apiKey.substring(0, 8)}...${apiKey.slice(-4)}`);
      if (options.subdomain) {
        debugLog(`   Subdomain: ${options.subdomain}`);
      }
      debugLog("");
      debugLog("🚧 lrok tunnel integration coming soon!");
      debugLog("   For now, use lrok CLI separately:");
      debugLog("   lrok <port> --name mcp-server");
      debugLog("");
    }

    const server = await createServer();
    setupExitWatchdog(server);

    const transport = new StdioServerTransport();
    await server.connect(transport);
  });

// Login command
program
  .command("login <api-key>")
  .description("Save API key to config file")
  .action((apiKey: string) => {
    if (!validateApiKey(apiKey)) {
      debugLog("❌ Invalid API key format (should start with 'lum_')");
      debugLog(`   Get your API key from: ${appConfig.keysUrl}`);
      process.exit(1);
    }
    
    saveApiKey(apiKey);
    debugLog("✅ API key saved successfully!");
    debugLog("");
    debugLog("You can now run with tunnel mode:");
    debugLog(`   ${packageJSON.name} --tunnel`);
  });

// Whoami command
program
  .command("whoami")
  .description("Show current API key configuration")
  .action(() => {
    const { key, source } = getApiKeyWithSource();
    
    if (key) {
      debugLog("✅ Logged in");
      debugLog(`   API Key: ${key.substring(0, 8)}...${key.slice(-4)}`);
      debugLog(`   Source: ${source}`);
    } else {
      debugLog("❌ Not logged in");
      debugLog("");
      debugLog("To login:");
      debugLog(`   ${packageJSON.name} login <your-api-key>`);
      debugLog("");
      debugLog("Or set environment variable:");
      debugLog("   export LUM_API_KEY='lum_your_key'");
      debugLog("");
      debugLog(`Get your API key: ${appConfig.keysUrl}`);
    }
  });

program.parse(process.argv);
