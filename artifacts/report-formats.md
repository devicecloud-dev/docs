# Report Formats

Device Cloud supports the standard Maestro report formats as well as [Allure](https://allurereport.org/), a widely used open-source reporting framework that provides enhanced visualisation and history tracking.

## Available Reports

We support the following report types:

- `junit`
- `html`
- `html-detailed`
- `allure`

You can enable each report using `--report <type>`.

The CLI will automatically download the report to your working directory for you after the run finishes. To change the download path, use the flag for that report format:

- `--junit-path <path>` (default `./report.xml`)
- `--html-path <path>` (default `./report.html`, applies to `html` and `html-detailed`)
- `--allure-path <path>` (default `./report.html`)

(`--artifacts-path` is a separate flag that sets the download path for the artifacts zip and requires `--download-artifacts`.)

## Types of Report

### JUnit

JUnit reports are XML-based and are generally the standard format for CI/CD reports.

### HTML and HTML-Detailed

HTML reports are human-readable provide a summary overview of a test run including failure screenshots. Detailed reports include test steps alongside everything from standard HTML reports.

### Allure

Allure reports are HTML-based and include rich and comprehensive visualisations of test results. Read more [here](https://allurereport.org/).