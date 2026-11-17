# IP Addresses

Returns the current list of DeviceCloud test-runner egress IP addresses, so your DevOps tooling can automate firewall allow-listing instead of updating it by hand whenever the addresses change.

This endpoint needs no API key, so automation can poll it without credentials. It isn't rate limited, and responses are cacheable (`Cache-Control: public, max-age=3600`), so polling once an hour is plenty.

The same data is published in human-readable form on the [IP Addresses](../security/ip-addresses.md) security page, which is regenerated daily from this endpoint.

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
| `ipAddresses` | `string[]` | Every address in one flat list, the simplest thing to allow-list. A single host (`/32`) appears as a bare IP; a wider range would appear in CIDR notation. |
| `ranges` | `object[]` | Structured view of each range (see below). |
| `ranges[].cidr` | `string` | The range in CIDR notation. Single hosts are expressed as `/32`. |
| `ranges[].platforms` | `string[]` | Runner platforms whose traffic egresses from this range — `android`, `ios`, or both. |
| `ranges[].type` | `string` | Traffic type. Currently always `egress` (outbound from the app under test). |
| `ranges[].description` | `string` | Human-readable note about the range. |

::: tip
If your firewall accepts CIDR notation, allow-list `ranges[].cidr`. Otherwise use the flat `ipAddresses` list, and check it for any entry in CIDR notation. Poll on a schedule and compare `updatedAt` to keep your allow-list in sync.
:::
