<p align="center">
  <img src="./.github/images/banner.png" alt="Lum Browser MCP banner" width="600">
</p>

<h1 align="center">Lum Browser MCP</h1>

<p align="center">
  Automate your browser with AI - powered by lum.tools
  <br />
  <a href="https://lum.tools"><strong>lum.tools</strong></a> 
  •
  <a href="https://platform.lum.tools"><strong>Platform</strong></a>
  •
  <a href="https://platform.lum.tools/keys"><strong>Get API Key</strong></a>
</p>

## About

Lum Browser MCP is an MCP server + Chrome extension that allows you to automate your browser using AI applications like VS Code, Claude, Cursor, and Windsurf.

This fork integrates with [lrok](https://github.com/lum-tools/lrok) to expose your local MCP server to the internet with secure HTTPS tunnels.

## Features

- ⚡ **Fast**: Automation happens locally on your machine, resulting in better performance without network latency.
- 🔒 **Private**: Since automation happens locally, your browser activity stays on your device and isn't sent to remote servers.
- 👤 **Logged In**: Uses your existing browser profile, keeping you logged into all your services.
- 🥷🏼 **Stealth**: Avoids basic bot detection and CAPTCHAs by using your real browser fingerprint.
- 🌐 **Tunnel Support**: Expose your MCP server to the internet using lrok tunnels (coming soon).

## Installation

```bash
npm install -g @lum-tools/browsermcp
```

## Usage

### Basic Usage

```bash
lum-browsermcp
```

### With lrok Tunnel (Coming Soon)

```bash
# Configure your API key (get one at https://platform.lum.tools/keys)
lum-browsermcp --api-key lum_your_api_key_here

# Or use environment variable
export LUM_API_KEY=lum_your_api_key_here
lum-browsermcp --tunnel
```

## Configuration

### API Key

Get your API key from [platform.lum.tools/keys](https://platform.lum.tools/keys) and save it:

```bash
# Via environment variable
export LUM_API_KEY=lum_your_api_key_here

# Or save to config file
# Config is stored in ~/.lrok/config.toml
```

## Links

- **lum.tools**: [lum.tools](https://lum.tools) - Main website
- **Platform**: [platform.lum.tools](https://platform.lum.tools) - Account management
- **API Keys**: [platform.lum.tools/keys](https://platform.lum.tools/keys) - Get your API key
- **lrok**: [github.com/lum-tools/lrok](https://github.com/lum-tools/lrok) - Tunnel service

## Contributing

This repo contains all the core MCP code for Lum Browser MCP.

## Credits

Lum Browser MCP was adapted from the [BrowserMCP](https://github.com/browsermcp/mcp) project, which was adapted from the [Playwright MCP server](https://github.com/microsoft/playwright-mcp).

## License

MIT License - see [LICENSE](LICENSE) file

---

**Made with ❤️ by [lum.tools](https://lum.tools)**
