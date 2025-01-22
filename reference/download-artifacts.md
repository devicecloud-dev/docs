# Download Artifacts

Device Cloud captures various artifacts during test execution that can help debug and analyze your test runs.

## Available Artifacts

Each test run generates:

* Logs
* Screenshots
* Videos
* Test reports

## Download Options

### Download All Artifacts

To download artifacts for all test runs:

```bash
dcd cloud ... --download-artifacts ALL
```

### Download Failed Test Artifacts

To download artifacts only for failed tests:

```bash
dcd cloud ... --download-artifacts FAILED
```

## Pricing

> **Note**: Downloading artifacts incurs a $0.01 egress fee per result.

## Artifact Management

### Storage Location

Artifacts are downloaded as a zip file containing:

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
└── summary.json # if [JUnit report](./report-formats.md) was requested
```
