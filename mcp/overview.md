# Older dcd-mcp Server

`dcd-mcp` is the older DeviceCloud MCP server. New setups use `dcd mcp`, the MCP server in the CLI: see [Connect an AI Agent](connect.md).

`dcd-mcp` is a second binary in the `@devicecloud.dev/dcd` npm package. It serves the same `dcd_*` [cloud test tools](tools.md) as `dcd mcp`: list devices, submit cloud test runs, check their status and download artifacts. It doesn't serve the [Agent Devices](agent-devices.md) tools, and it has no `install` command. You only need it for a setup that already uses it.

::: warning
We accept no liability for anything your agent may read or execute. LLMs are a new technology: use them with care and at your own risk.
:::

## Setup

Add the server to your MCP client's configuration. It runs over stdio through `npx`, which needs Node 22 or later:

```jsonc
{
  "mcpServers": {
    "devicecloud": {
      "command": "npx",
      "args": ["-y", "--package=@devicecloud.dev/dcd", "dcd-mcp"],
      "env": { "DEVICE_CLOUD_API_KEY": "<your-api-key>" }
    }
  }
}
```

The `--package=` form matters: it tells `npx` to run the package's `dcd-mcp` binary. Without it, `npx` runs the `dcd` CLI instead, which rejects `dcd-mcp` as an unknown command.

::: info
`dcd-mcp` is in the npm package only, so it needs Node even if you installed the CLI with the binary installer. The standalone `dcd` binary has `dcd mcp` instead: see [Connect an AI Agent](connect.md).
:::

## Authentication

Auth is inherited from the CLI:

- Set `DEVICE_CLOUD_API_KEY` in the server's `env` (as above) — **recommended**, **or**
- Run [`dcd login`](../cli/dcd-login.md) once and the server will pick up the stored session.

When both are present, the environment variable wins. With a `dcd login` session, the server works in your active team, the one [`dcd switch-org`](../cli/dcd-login.md#dcd-switch-org) sets. After you switch teams, restart your MCP client: a running server can keep using the old team for up to an hour.

Credentials are resolved lazily on the first tool call, not at startup — so your client can connect and enumerate the tools before you've supplied a key, and a bad credential surfaces as a tool error rather than a server that won't start.

::: warning
A `dcd login` session ends 30 days after you log in, or after 7 days without use. The server refreshes the session while it runs, but once the session ends, every tool call fails with a message telling you to run `dcd login` again. The server picks up the new session on the next call, without a restart. Use an API key for servers that stay running.
:::

## Tools

The server exposes five tools. Four are read-only; `dcd_run_cloud_test` submits a run and is billable.

| Tool | What it does |
|------|--------------|
| [`dcd_list_devices`](tools.md#dcd-list-devices) | Discover available devices, OS versions, and Maestro versions |
| [`dcd_list_runs`](tools.md#dcd-list-runs) | List recent test runs (filter by name/date, paginated) |
| [`dcd_get_status`](tools.md#dcd-get-status) | Get the status and per-test results of a run |
| [`dcd_download_artifacts`](tools.md#dcd-download-artifacts) | Download a run's artifacts zip, and optionally a report, to disk |
| [`dcd_run_cloud_test`](tools.md#dcd-run-cloud-test) | Submit a flow to run on the cloud (**billable**) |

See [Cloud Test Tools](tools.md) for every parameter, default, and return shape.

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
      "args": ["-y", "--package=@devicecloud.dev/dcd", "dcd-mcp", "--read-only"],
      "env": { "DEVICE_CLOUD_API_KEY": "<your-api-key>" }
    }
  }
}
```
