# Report Formats

Device Cloud supports standard Maestro report formats as well as Allure, a DeviceCloud-specific format that provides enhanced visualisation and history tracking.

## Available Reports

We support the following report types:

- `junit`
- `html`
- `html-detailed`
- `allure`

You can enable each report using `--report <type>`.

The CLI will automatically download the report to your working directory for you after the run finishes. To change the download path, pass `--artifacts-path=<path>`.

## Types of Report

### JUnit

JUnit reports are XML-based and are generally the standard format for CI/CD reports.

### HTML and HTML-Detailed

HTML reports are human-readable provide a summary overview of a test run including failure screenshots. Detailed reports include test steps alongside everything from standard HTML reports.

### Allure

Allure reports are HTML-based and include rich and comprehensive visualisations of test results. Read more [here](https://allurereport.org/).