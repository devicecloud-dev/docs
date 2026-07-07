# IP Addresses

Returns the current list of DeviceCloud test-runner egress IP addresses, so your DevOps tooling can automate firewall allow-listing instead of updating it by hand whenever the addresses change.

Unlike the other REST API endpoints, this one is **public** — no API key is required — so automation can poll it without credentials. Responses are cacheable (`Cache-Control: public, max-age=3600`); polling once an hour is plenty.

The same data is published in human-readable form on the [IP Addresses](../security/ip-addresses.md) security page, which is generated from this endpoint — so the two never drift.

---

## Get IP addresses

```
GET /ip-addresses
```

**Example**

```bash
curl https://api.devicecloud.dev/ip-addresses
```

**Response**

```json
{
  "updatedAt": "2026-07-06",
  "ipAddresses": [
    "46.17.215.144",
    "46.17.215.145",
    "83.217.174.249"
  ],
  "ranges": [
    {
      "cidr": "46.17.215.144/32",
      "platforms": ["android", "ios"],
      "type": "egress",
      "description": "Test runner egress"
    }
  ]
}
```

**Fields**

| Field | Type | Description |
|-------|------|-------------|
| `updatedAt` | `string` | ISO date (`YYYY-MM-DD`) the list last changed. Watch this to detect updates without diffing the whole payload. |
| `ipAddresses` | `string[]` | Flat list of bare IP addresses — the simplest thing to allow-list. |
| `ranges` | `object[]` | Structured view of each range (see below). |
| `ranges[].cidr` | `string` | The range in CIDR notation. Single hosts are expressed as `/32`. |
| `ranges[].platforms` | `string[]` | Runner platforms whose traffic egresses from this range — `android`, `ios`, or both. |
| `ranges[].type` | `string` | Traffic type. Currently always `egress` (outbound from the app under test). |
| `ranges[].description` | `string` | Human-readable note about the range. |

> **Tip:** If your firewall accepts CIDR notation, allow-list `ranges[].cidr`; otherwise use the flat `ipAddresses` list. Poll on a schedule and reconcile against `updatedAt` to keep your allow-list in sync automatically.
