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

```
Recent Uploads
════════════════════════════════════════════════════════════════════════════════
   Showing 3 of 3 uploads

   Nightly regression
      ID:      7e12345f-eb12-12ec-a30b-bb1234f1d12a
      Created: Jan 15, 2026, 10:30 AM
      Console: https://console.devicecloud.dev/results?upload=7e12345f-...

   Smoke tests
      ID:      ...
      ...

Tip: Use dcd status --upload-id <id> for detailed test results
```
