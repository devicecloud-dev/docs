# dcd list

List recent test uploads for your organisation.

```bash
dcd list [flags]
```

## Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--limit <n>` | `20` | Maximum number of uploads to return |
| `--offset <n>` | `0` | Number of uploads to skip (for pagination) |
| `--name <pattern>` | | Filter by upload name. Supports `*` as a wildcard — always quote wildcards to prevent shell expansion |
| `--from <date>` | | Return uploads created on or after this date (ISO 8601, e.g. `2024-01-01`) |
| `--to <date>` | | Return uploads created on or before this date (ISO 8601) |
| `--api-key <key>` | | Your DeviceCloud API key. Defaults to `DEVICE_CLOUD_API_KEY` env var |
| `--json` | | Output results as JSON |

## Examples

```bash
# List the 20 most recent uploads
dcd list

# List with a wildcard name filter (note the quotes)
dcd list --name "nightly-*"

# Filter by date range
dcd list --from 2024-01-01 --to 2024-01-31

# Paginate
dcd list --limit 10 --offset 20

# JSON output
dcd list --json
```

{% hint style="info" %}
Always quote wildcard patterns to prevent your shell from expanding them before they reach the CLI — use `"nightly-*"` not `nightly-*`.
{% endhint %}

## Output

For example, `dcd list --limit 2` prints:

```
⏺ Recent Uploads
  showing 2 of 45
  ⎿ Nightly regression
    id        7e12345f-eb12-12ec-a30b-bb1234f1d12a
    created   Sep 22, 2026, 10:30 AM
    console   https://console.devicecloud.dev/results?upload=7e12345f-eb12-12ec-a30b-bb1234f1d12a
  ⎿ Smoke tests
    id        3f9c2a71-5d4e-4b8a-9c0f-1e2d3c4b5a69
    created   Sep 22, 2026, 09:15 AM
    console   https://console.devicecloud.dev/results?upload=3f9c2a71-5d4e-4b8a-9c0f-1e2d3c4b5a69

Use --offset 2 to see the next 2 uploads
ℹ Use dcd status --upload-id <id> for detailed test results
```

Uploads without a name are listed as `(unnamed)`. With `--json`, the CLI prints the API response as-is: `{ "uploads": [{ "id", "name", "created_at", "consoleUrl" }], "total", "limit", "offset" }`.
