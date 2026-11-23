# Artifacts & Downloads

DeviceCloud keeps the logs, screenshots, videos and reports from every test run. You can download them during a `dcd cloud` run, afterwards with `dcd artifacts`, or from the console.

## Available Artifacts

Each test run generates:

* Logs
* Screenshots, including the diff image from every [`assertScreenshot`](../advanced/visual-testing.md#reading-a-failure) that doesn't match, whether it failed the flow or was `optional: true` and only warned
* A screenshot and a screen hierarchy (the on-screen element tree, as JSON) for each step that failed or warned, on Maestro 2.7 and later
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

# Download one flow's artifacts only
dcd artifacts --upload-id <uuid> --download-artifacts ALL --flow login

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
│   │   ├── login-step-004-tapOn.json
│   │   ├── login-step-009-tapOn.json
│   │   └── ...
│   ├── screenshots/
│   │   ├── login-failure-screenshot.jpg
│   │   ├── login-step-004-tapOn.jpg
│   │   └── login-diff-screenshots-home_diff.png
│   └── videos/
│       └── login-recording.mp4
├── 4502/
│   ├── logs/
│   ├── screenshots/
│   └── videos/
└── report.xml  # merged JUnit report covering every test in the download
```

Files are named after the flow file (without its extension), e.g. `login-maestro.log` for `login.yaml`. In `screenshots/`, a failed flow has one `-failure-screenshot.jpg` of the whole screen, each `takeScreenshot` is named after its `path` (`login-home.jpg` for `takeScreenshot: home`), and each `assertScreenshot` diff is named after its baseline (see [Reading a failure](../advanced/visual-testing.md#reading-a-failure)). Screenshots taller than 1080 px are downscaled to 1080 px tall and saved as JPEG; smaller ones, such as a crop made with `cropOn`, keep their size. Diffs are always full-size PNGs. The `logs/` folder also holds stdout/stderr, the device log (`-logcat.zip` on Android, `-ios-device-log.zip` on iOS) and any per-flow reports. With `--download-artifacts FAILED`, only failed tests get a folder, but `report.xml` is always included and still covers every test.

### Step screenshots and screen hierarchies

On Maestro 2.7 and later, each step that failed or warned (an `optional: true` step that didn't succeed) also has:

* its screen hierarchy in `logs/`, named `<flow>-step-<NNN>-<command>.json`
* its screenshot in `screenshots/`, named `<flow>-step-<NNN>-<command>.jpg`

The flow's `commands.json` lists these as `SCREEN_HIERARCHY` and `SCREENSHOT` artifacts at the paths Maestro wrote them to, such as `screen-hierarchy/step-009-tapOn.json` and `screenshots/step-009-tapOn.png`. To find a step's files in the archive, match on the `step-<NNN>` number. Two differences from those paths: screenshots are saved as JPEG like every other screenshot, and the step that failed the flow keeps its screenshot under the usual `-failure-screenshot.jpg` name. Secret-named variables are masked in screen hierarchies as they are in `commands.json`, within the limits in [Environment Variables](../configuration/environment-variables.md).

### One flow at a time

`--flow` or `--result-id` narrows the download to one flow on one device: its first attempt and every retry, each in its own result-ID folder. `report.xml` then covers just that flow. See the [`dcd artifacts` reference](../cli/dcd-artifacts.md) for how `--flow` matches a flow.

Each [retry](../advanced/retry-strategies.md#seeing-every-attempt) attempt gets its own result-ID folder, so the failed attempt's screenshots and video are in the zip even if a retry passed.

## Report formats

DeviceCloud supports the standard Maestro report formats: JUnit and HTML.

::: warning
`allure` and `html-detailed` are deprecated. We're targeting their removal on **7 December 2026**, subject to change based on usage. Once they're removed, runs that pass them still run and don't fail:

- `--report html-detailed` gets the standard HTML report.
- `--report allure` gets no report.

To move now, use `--report html` or `--report junit`.
:::

### Available Reports

We support the following report types:

- `junit`
- `html`
- `html-detailed` (deprecated, removal targeted for 7 December 2026)
- `allure` (deprecated, removal targeted for 7 December 2026)

You can enable each report using `--report <type>`. `--format` is an alias for `--report`.

The CLI will automatically download the report to your working directory for you after the run finishes. To change the download path, use the flag for that report format:

- `--junit-path <path>` (default `./report.xml`)
- `--html-path <path>` (default `./report.zip`, applies to `html` and `html-detailed`)
- `--allure-path <path>` (default `./report.html`)

::: info
The `html` and `html-detailed` reports are downloaded as a ZIP archive (the report plus its screenshots, videos and logs). Unzip it to view the report.
:::

(`--artifacts-path` is a separate flag that sets the download path for the artifacts zip and requires `--download-artifacts`.)

### Types of Report

#### JUnit

JUnit reports are XML-based and are generally the standard format for CI/CD reports.

#### HTML and HTML-Detailed

HTML reports are human-readable and provide a summary of a test run, including failure screenshots. Both are delivered as a ZIP containing the report and the files it links to. Detailed reports add the test steps to everything in a standard HTML report. `html-detailed` is deprecated: once it's removed (targeted for 7 December 2026), it gives the standard HTML report.

#### Allure

Allure reports are HTML-based and are downloaded as a single, self-contained HTML file. Allure is deprecated, and we're targeting its removal on 7 December 2026. Once it's removed, runs that pass `--report allure` get no report. Use `html` or `junit` instead.

## Retention

App binaries and workspaces are deleted 1 month after they were last used. Test results, their artifacts (logs, screenshots and videos) and the environment variables passed with `--env` are kept for 6 months.
