# CLI Reference

The DCD CLI is the primary way to interact with DeviceCloud from your terminal or CI/CD pipeline. It is published as `@devicecloud.dev/dcd` on npm.

## Installation

```bash
npm install -g @devicecloud.dev/dcd
```

## Authentication

All commands require an API key. Set it as an environment variable to avoid passing it on every command:

```bash
export DEVICE_CLOUD_API_KEY=your-api-key
```

Or pass it explicitly with `--api-key <key>` on any command. You can find your API key in the console under **Settings → API Key**.

## Commands

| Command | Description |
|---------|-------------|
| [`dcd cloud`](dcd-cloud.md) | Upload an app and run Maestro flows on DeviceCloud |
| [`dcd upload`](dcd-upload.md) | Upload an app binary and get a reusable binary ID |
| [`dcd status`](dcd-status.md) | Check the status of a test upload |
| [`dcd list`](dcd-list.md) | List recent uploads for your organisation |
| `dcd help` | Display help for any command |

## Getting Help

```bash
dcd help
dcd help cloud
dcd help status
```
