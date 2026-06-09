# Download Artifacts

DeviceCloud captures various artifacts during test execution that can help debug and analyze your test runs.

## Available Artifacts

Each test run generates:

* Logs
* Screenshots
* Videos
* Test reports

## Download Options

There are two ways to download artifacts: inline during a `dcd cloud` run, or on-demand after the fact using `dcd artifacts`.

### Inline (during `dcd cloud`)

Pass `--download-artifacts` directly to the `cloud` command and artifacts are downloaded automatically when the run completes:

```bash
# Download artifacts for all tests
dcd cloud app.apk flows/ --download-artifacts ALL

# Download artifacts for failed tests only
dcd cloud app.apk flows/ --download-artifacts FAILED

# Save to a custom path
dcd cloud app.apk flows/ --download-artifacts FAILED --artifacts-path ./failed.zip
```

### On-demand (`dcd artifacts`)

Use the [`dcd artifacts`](../cli/dcd-artifacts.md) command to download artifacts or reports for any completed run by its upload ID. This is useful when tests were submitted with `--async`, or when you need to pull reports after the fact:

```bash
# Download a zip of all artifacts
dcd artifacts --upload-id <uuid> --download-artifacts ALL

# Download a JUnit report
dcd artifacts --upload-id <uuid> --report junit

# Download an Allure report
dcd artifacts --upload-id <uuid> --report allure --allure-path ./allure-report.html
```

See the [`dcd artifacts` reference](../cli/dcd-artifacts.md) for the full flag list.

### From the Console

Artifacts and workspace downloads are also available directly from the test result page in the [DeviceCloud console](https://console.devicecloud.dev). Use the download menu on any completed result to save videos, logs, screenshots, or the full workspace bundle.

## Artifact Archive Structure

Artifacts are downloaded as a zip file:

```
artifacts/
├── test1/
│   ├── logs/
│   ├── screenshots/
│   └── video/
├── test2/
│   ├── logs/
│   ├── screenshots/
│   └── video/
└── report.xml  # if JUnit report was requested
```
