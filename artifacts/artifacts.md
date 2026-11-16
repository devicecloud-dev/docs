# Artifacts & Downloads

DeviceCloud keeps the logs, screenshots, videos and reports from every test run. You can download them during a `dcd cloud` run, afterwards with `dcd artifacts`, or from the console.

## Available Artifacts

Each test run generates:

* Logs
* Screenshots, including the diff image from every [`assertScreenshot`](../advanced/visual-testing.md#reading-a-failure) that doesn't match, whether it failed the flow or was `optional: true` and only warned
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

# Download the HTML report
dcd artifacts --upload-id <uuid> --report html --html-path ./report.zip
```

One `dcd artifacts` command can't take both `--download-artifacts` and `--report`. To get the artifacts and a report, run it twice.

See the [`dcd artifacts` reference](../cli/dcd-artifacts.md) for the full flag list.

### From the Console

Each test result in the [DeviceCloud console](https://console.devicecloud.dev) has a download menu with the files for that result: `commands.json`, the Maestro log, Maestro stdout and stderr, the logcat (Android), the HTML, JUnit and Allure reports (when the run generated them; Allure is deprecated, see [Deprecations & Removals](../getting-started/deprecations.md)), the app binary (APK or APP build) and the workspace. Videos and screenshots are shown on the result page; to download them in bulk, use `--download-artifacts` or `dcd artifacts`.

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
│   │   ├── login-failure-screenshot.jpg
│   │   └── login-diff-screenshots-home_diff.png
│   └── videos/
│       └── login-recording.mp4
├── 4502/
│   ├── logs/
│   ├── screenshots/
│   └── videos/
└── report.xml  # merged JUnit report covering every test in the upload
```

Files are named after the flow file (without its extension), e.g. `login-maestro.log` for `login.yaml`. In `screenshots/`, a failed flow has one `-failure-screenshot.jpg` of the whole screen, each `takeScreenshot` is named after its `path` (`login-home.jpg` for `takeScreenshot: home`), and each `assertScreenshot` diff is named after its baseline (see [Reading a failure](../advanced/visual-testing.md#reading-a-failure)). Screenshots taller than 1080 px are downscaled to 1080 px tall and saved as JPEG; smaller ones, such as a crop made with `cropOn`, keep their size. Diffs are always full-size PNGs. The `logs/` folder also holds stdout/stderr, the device log (`-logcat.zip` on Android, `-ios-device-log.zip` on iOS) and any per-flow reports. With `--download-artifacts FAILED`, only failed tests get a folder, but `report.xml` is always included and still covers every test.

Each [retry](../advanced/retry-strategies.md#seeing-every-attempt) attempt gets its own result-ID folder, so the failed attempt's screenshots and video are in the zip even if a retry passed.

## Retention

App binaries and workspaces are deleted 1 month after they were last used. Test results, their artifacts (logs, screenshots and videos) and the environment variables passed with `--env` are kept for 6 months.
