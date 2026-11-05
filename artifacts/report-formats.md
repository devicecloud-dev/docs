# Report Formats

Device Cloud supports the standard Maestro report formats: JUnit and HTML.

::: warning
`allure` and `html-detailed` are deprecated and **will be removed on 7 December 2026**. From that date, runs that pass them still run and don't fail:

- `--report html-detailed` gets the standard HTML report.
- `--report allure` gets no report.

To move now, use `--report html` or `--report junit`.
:::

## Available Reports

We support the following report types:

- `junit`
- `html`
- `html-detailed` (deprecated, removed on 7 December 2026)
- `allure` (deprecated, removed on 7 December 2026)

You can enable each report using `--report <type>`.

The CLI will automatically download the report to your working directory for you after the run finishes. To change the download path, use the flag for that report format:

- `--junit-path <path>` (default `./report.xml`)
- `--html-path <path>` (default `./report.zip`, applies to `html` and `html-detailed`)
- `--allure-path <path>` (default `./report.html`)

::: info
The `html` and `html-detailed` reports are downloaded as a ZIP archive (the report plus its screenshots, videos and logs). Unzip it to view the report. CLI versions before 5.10.0 name the file `report.html` by default, so with those, pass `--html-path ./report.zip` to give it the right extension.
:::

(`--artifacts-path` is a separate flag that sets the download path for the artifacts zip and requires `--download-artifacts`.)

## Types of Report

### JUnit

JUnit reports are XML-based and are generally the standard format for CI/CD reports.

### HTML and HTML-Detailed

HTML reports are human-readable and provide a summary of a test run, including failure screenshots. Both are delivered as a ZIP containing the report and the files it links to. Detailed reports add the test steps to everything in a standard HTML report. `html-detailed` is deprecated: from 7 December 2026 it gives the standard HTML report.

### Allure

Allure reports are HTML-based and are downloaded as a single, self-contained HTML file. Allure is deprecated and will be removed on 7 December 2026. From that date, runs that pass `--report allure` get no report. Use `html` or `junit` instead.
