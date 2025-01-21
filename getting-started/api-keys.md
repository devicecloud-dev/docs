# API Keys

Device Cloud uses API keys for authentication. This guide explains how to obtain, use, and manage your API keys.

## Getting Your API Key

1. Log in to [devicecloud.dev](https://devicecloud.dev)
2. Navigate to the console UI
3. Find your API key in the settings/account section

## Using Your API Key

### Command Line
```bash
dcd cloud --apiKey your-api-key-here
```

### Environment Variable
```bash
export DEVICE_CLOUD_API_KEY=your-api-key-here
dcd cloud  # Key will be automatically used
```
