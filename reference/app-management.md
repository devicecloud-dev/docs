# App Management

Device Cloud provides several ways to manage your application binaries during test execution.

## App Binary Options



You have two ways to specify your application binary:

1. **Direct File Upload**

```bash
dcd cloud --app-file ./path/to/your/app.apk flow.yaml
```

2. **Using Previously Uploaded Binary**

```bash
dcd cloud --app-binary-id abc123 flow.yaml
```



## Binary Management

### SHA Hash Checking

By default, Device Cloud checks the SHA hash of your binary to avoid redundant uploads (it will automatically work out the app-binary-id for you). To override:

```bash
dcd cloud --app-file ./app.apk --ignore-sha-check
```

Use this when:

* You need to force a re-upload of the same binary
* You're experiencing hash verification issues
