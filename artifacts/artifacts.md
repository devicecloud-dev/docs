# Download Artifacts

DeviceCloud captures various artifacts during test execution that can help debug and analyze your test runs.

## Available Artifacts

Each test run generates:

* Logs
* Screenshots, including the diff image from a failed [`assertScreenshot`](../advanced/visual-testing.md#reading-a-failure) comparison
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

Each test result in the [DeviceCloud console](https://console.devicecloud.dev) has a download menu with the files for that result: `commands.json`, the Maestro log, Maestro stdout and stderr, the logcat (Android), the HTML, JUnit and Allure reports (when the run generated them), the app binary (APK or APP build) and the workspace. Videos and screenshots are shown on the result page; to download them in bulk, use `--download-artifacts` or `dcd artifacts`.

## Artifact Archive Structure

Artifacts are downloaded as a zip file with one folder per test result, named after the result ID:

```
artifacts.zip
├── 4501/
│   ├── logs/
│   │   ├── login-maestro.log
│   │   ├── login-commands.json
│   │   └── ...
│   ├── screenshots/
│   └── videos/
│       └── login-recording.mp4
├── 4502/
│   ├── logs/
│   ├── screenshots/
│   └── videos/
└── report.xml  # merged JUnit report covering every test in the upload
```

Files are named after the flow file (without its extension), e.g. `login-maestro.log` for `login.yaml`. The `logs/` folder also holds stdout/stderr, the device log (`-logcat.zip` on Android, `-ios-device-log.zip` on iOS) and any per-flow reports. With `--download-artifacts FAILED`, only failed tests get a folder, but `report.xml` is always included and still covers every test.

## Retention

App binaries and workspaces are deleted 1 month after they were last used. Test results and their artifacts (logs, screenshots and videos) are kept for 6 months.
