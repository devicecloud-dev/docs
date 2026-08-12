# MCP Server

The `@devicecloud.dev/dcd` package ships a second binary, `dcd-mcp` — a [Model Context Protocol](https://modelcontextprotocol.io) server that lets AI agents (Claude, Cursor, VS Code, and other MCP clients) drive DeviceCloud directly: list devices, submit cloud test runs, check status, and download artifacts.

{% hint style="warning" %}
The MCP server is a new, beta capability. The tool surface may change.
{% endhint %}

{% hint style="warning" %}
Please note that we accept no liability for anything your agent(s) may read or execute when using our MCP server. LLMs are a new technology and should be used with caution at your own risk.
{% endhint %}

## Setup

Add the server to your MCP client's configuration. It runs over stdio via `npx`, so there's nothing to install separately:

```jsonc
{
  "mcpServers": {
    "devicecloud": {
      "command": "npx",
      "args": ["-y", "@devicecloud.dev/dcd", "dcd-mcp"],
      "env": { "DEVICE_CLOUD_API_KEY": "<your-api-key>" }
    }
  }
}
```

## Authentication

Auth is inherited from the CLI:

- Set `DEVICE_CLOUD_API_KEY` in the server's `env` (as above), **or**
- Run [`dcd login`](../cli/dcd-login.md) once and the server will pick up the stored session.

When both are present, the environment variable wins.

Credentials are resolved lazily on the first tool call, not at startup — so your client can connect and enumerate the tools before you've supplied a key, and a bad credential surfaces as a tool error rather than a server that won't start.

## Tools

The server exposes five tools. Four are read-only; `dcd_run_cloud_test` submits a run and is billable.

| Tool | What it does |
|------|--------------|
| [`dcd_list_devices`](tools.md#dcd-list-devices) | Discover available devices, OS versions, and Maestro versions |
| [`dcd_list_runs`](tools.md#dcd-list-runs) | List recent test runs (filter by name/date, paginated) |
| [`dcd_get_status`](tools.md#dcd-get-status) | Get the status and per-test results of a run |
| [`dcd_download_artifacts`](tools.md#dcd-download-artifacts) | Download a run's artifacts or report to disk |
| [`dcd_run_cloud_test`](tools.md#dcd-run-cloud-test) | Submit a flow to run on the cloud (**billable**) |

See [Tools Reference](tools.md) for every parameter, default, and return shape.

## Read-only mode

`dcd_run_cloud_test` consumes test credits, so it's annotated as a destructive/non-read-only tool so well-behaved clients can (and should) prompt before calling it. To hide it entirely (recommended for autonomous or untrusted agents), either:

- pass `--read-only` in `args`, or
- set `DCD_MCP_READONLY=1` in `env`.

The remaining tools are all read-only. A read-only server doesn't just refuse the tool — it never advertises it, so an agent can't attempt a billable run at all:

```jsonc
{
  "mcpServers": {
    "devicecloud": {
      "command": "npx",
      "args": ["-y", "@devicecloud.dev/dcd", "dcd-mcp", "--read-only"],
      "env": { "DEVICE_CLOUD_API_KEY": "<your-api-key>" }
    }
  }
}
```
