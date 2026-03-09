# REST API

The DeviceCloud REST API gives you programmatic access to the same data available in the console — test results, upload history, and flow analytics.

## Authentication

Include your API key in every request:

```
x-app-api-key: <your-api-key>
```

You can find your API key in the console under **Settings → API Key**.

## Base URL

```
https://api.devicecloud.dev
```

## Endpoints

| Resource | Description |
|----------|-------------|
| [Uploads](uploads.md) | List uploads and poll run status |
| [Results](results.md) | Fetch results, reports, and artifacts for an upload |
| [Flows](flows.md) | Aggregated analytics and run history per flow file |
