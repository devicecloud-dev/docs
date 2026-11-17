# App Management

DeviceCloud provides several ways to manage your application binaries during test execution.

## App Binary Options

You can pass your application binary in any of these ways:

1. **As the first argument**

```bash
dcd cloud ./path/to/your/app.apk flows/
```

2. **With `--app-file`**

```bash
dcd cloud --app-file ./path/to/your/app.apk flows/
```

3. **Using a previously uploaded binary**

```bash
dcd cloud --app-binary-id 67894274-b789-4c1e-80d4-da8998998999 flows/
```

`dcd cloud` prints the binary ID when it uploads your app, or when it finds the same build already uploaded. You can also upload the binary on its own with [`dcd upload`](../cli/dcd-upload.md), which prints the ID:

```bash
dcd upload ./path/to/your/app.apk
```

4. **From an Expo build URL** (iOS only)

```bash
dcd cloud --app-url "<signed-expo-build-url>" flows/
```

The URL must point to an Expo iOS simulator build (`.tar.gz`). The CLI downloads the archive and extracts the `.app` inside it. Expo signed URLs expire after about an hour.

### Supported file types

| File | Platform |
|------|----------|
| `.apk` | Android |
| `.app` | iOS simulator build |
| `.zip` | iOS: a zip whose only top-level item is the `.app` (`__MACOSX` and `.DS_Store` entries are ignored) |
| `.tar.gz` | iOS: an Expo simulator build archive, extracted automatically |

iOS runs need a simulator build. Device builds (`.ipa`) and Android App Bundles (`.aab`) aren't accepted, so build an `.apk` for Android.

## Binary Management

### SHA Hash Checking

By default, DeviceCloud checks the SHA hash of your binary to avoid redundant uploads (it will automatically work out the app-binary-id for you). Envelope-encrypted uploads (the default) are only matched against your earlier envelope-encrypted uploads, so a binary you previously uploaded with `--no-encrypt` is uploaded once more the first time it's envelope-encrypted. To override:

```bash
dcd cloud --app-file ./app.apk flows/ --ignore-sha-check
```

Use this when:

* You need to force a re-upload of the same binary
* You're experiencing hash verification issues

### Retention

Uploaded binaries are deleted after 1 month without use. After that, runs that reference the binary's ID fail, so upload the build again.
