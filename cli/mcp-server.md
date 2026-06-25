# MCP Server

The `@devicecloud.dev/dcd` package ships a second binary, `dcd-mcp` — a [Model Context Protocol](https://modelcontextprotocol.io) server that lets AI agents (Claude, Cursor, VS Code, and other MCP clients) drive DeviceCloud directly: list devices, submit cloud test runs, check status, and download artifacts.

{% hint style="warning" %}
The MCP server is a new, beta capability. The tool surface may change.
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
- Run [`dcd login`](dcd-login.md) once and the server picks up the stored session.

Point the server at a non-production environment with the `DCD_API_URL` environment variable.

## Tools

| Tool | What it does |
|------|--------------|
| `dcd_list_devices` | Discover available devices, OS versions, and Maestro versions |
| `dcd_list_runs` | List recent test runs (filter by name/date, paginated) |
| `dcd_get_status` | Get the status and per-test results of a run |
| `dcd_download_artifacts` | Download a run's artifacts or report to disk |
| `dcd_run_cloud_test` | Submit a flow to run on the cloud (**billable**) |

By default `dcd_run_cloud_test` is asynchronous: it returns an `uploadId` immediately, which you poll with `dcd_get_status`. Pass `wait: true` (bounded by `waitTimeoutSeconds`) to block until the run completes, or `dryRun: true` to preview the flows without submitting.

## Read-only mode

`dcd_run_cloud_test` consumes test minutes, so it's annotated as a destructive/non-read-only tool — well-behaved clients can prompt before calling it. To hide it entirely (recommended for autonomous or untrusted agents), either:

- pass `--read-only` in `args`, or
- set `DCD_MCP_READONLY=1` in `env`.

The remaining tools are all read-only.
