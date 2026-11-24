# REST API

The DeviceCloud REST API gives you programmatic access to the same data available in the console — test results, upload history, and flow analytics. It also lets an AI agent drive a cloud device through [device sessions](device-sessions.md), and lists the test runners' [IP addresses](ip-addresses.md).

The API doesn't start test runs. To start one, use [`dcd cloud`](../cli/dcd-cloud.md) or one of the [CI integrations](../ci-cd/overview.md), then read the results here.

## Authentication

Include your API key in every request:

```
x-app-api-key: <your-api-key>
```

You can create an API key in the console under **Settings → API Keys**. The full key is shown only once, when it's created or rotated, so store it securely.

A key's **Access**, chosen when you create it, limits what it can reach. **Full access** reaches every endpoint. **CI: run tests only** reaches the run status, results and report endpoints, and only for runs that key started. **Device sessions only** reaches the [device session](device-sessions.md) endpoints. An endpoint outside a key's access answers `403` with `API_KEY_SCOPE`. See [Key access](../getting-started/api-keys.md#key-access).

Requests can also be authenticated with a DeviceCloud login session, which is how the CLI authenticates after `dcd login`: send `Authorization: Bearer <access-token>` together with `x-dcd-org: <team-id>`, where the signed-in user must be a member of that team. The team ID is a number: `dcd whoami --json` shows it as `org.id`. For scripts and CI, use an API key.

A missing or invalid API key returns HTTP `403`.

## Base URL

```
https://api.devicecloud.dev
```

## Rate limits

Each endpoint accepts up to 60 requests a minute. Over the limit, the API answers HTTP `429 Too Many Requests` with a `Retry-After` header. Wait that many seconds, then retry, and back off further if you get `429` again.

These endpoints aren't counted, so they're safe to poll: [`GET /results/:uploadId`](results.md#get-results), [`GET /uploads/status`](uploads.md#get-upload-status) and [`GET /ip-addresses`](ip-addresses.md). [Device sessions](device-sessions.md#rate-limits) have their own limits.

## Errors

Errors are JSON, with an HTTP status code that matches the error. Most look like this:

```json
{
  "statusCode": 403,
  "message": "Invalid API key. Please check your API key and ensure it is valid for this environment.",
  "error": "Forbidden"
}
```

`statusCode` repeats the HTTP status. `message` says what went wrong, and some validation errors give a list of messages. `error` is either the status text, as here, or a stable code such as `API_KEY_SCOPE`. Match on codes, never on `message` text. Some errors add more fields; ignore those you don't know.

Any endpoint that needs an API key can answer:

- `403` with `"error": "API_KEY_SCOPE"`: the key's access doesn't cover this endpoint, such as a key limited to **Device sessions only** calling `GET /uploads/list`.
- `503` with the message "Could not validate the API key right now": the API couldn't check your key. Retry. It doesn't mean the key is invalid.

The [JUnit report](results.md#download-junit-report) and [HTML report](results.md#download-html-report) downloads, and the [bundle manifests](results.md#download-zips-through-the-cdn), answer an error with a `message` only.

Three endpoints report client errors differently: [`GET /results/:uploadId`](results.md#get-results), [`GET /flows`](flows.md#get-flow-summaries) and [`GET /flows/runs`](flows.md#get-runs-for-a-flow) respond with HTTP `200` and report the error in the body instead:

```json
{
  "statusCode": 400,
  "message": "fileName query parameter is required."
}
```

Check the `statusCode` field in the body as well as the HTTP status. A malformed upload ID (not a UUID) is rejected with a real HTTP `400`.

## Endpoints

| Resource | Description |
|----------|-------------|
| [Uploads](uploads.md) | List uploads and poll run status |
| [Results](results.md) | Fetch results, reports, and artifacts for an upload |
| [Flows](flows.md) | Aggregated analytics and run history per flow file |
| [Team Settings](team-settings.md) | How your team is set up: concurrency, test runtime, integrations and more |
| [Device Sessions](device-sessions.md) | Start a device and drive it, for AI agents |
| [IP Addresses](ip-addresses.md) | Current egress IPs for firewall allow-listing (no API key required) |

## OpenAPI specification

Every endpoint above is described in an [OpenAPI 3.1 specification](https://docs.devicecloud.dev/openapi.yaml). Import it into Postman, Insomnia or Bruno, generate a client from it, or give it to an AI agent.
