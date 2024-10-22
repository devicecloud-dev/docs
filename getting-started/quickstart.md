# Quickstart

The dcd command line is intentionally designed to mimic the maestro cloud API.

In many cases, you can just change `maestro cloud` to `dcd cloud`:

```bash
# maestro cloud --apiKey <apiKey> <appFile> <flowFile>

dcd cloud --apiKey <apiKey> <appFile> <flowFile>
```

### 1. Install the CLI

Install npm ([instructions here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)), then run this command:

```
npm install -g @devicecloud.dev/dcd
```

### 2. Get your API key

You'll need an API key to trigger a flow run.

This can be found in the [dcd console](https://console.devicecloud.dev/settings) settings page.

### 3. Run your first flow

**iOS**

```
dcd cloud --apiKey <apiKey> <appFile>.app <flowFile>
```

**Android**

```
dcd cloud --apiKey <apiKey> <appFile>.apk <flowFile>
```

That's it!

Questions? Issues? Head to our Discord.
