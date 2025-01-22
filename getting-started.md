# Getting Started

## Installation

```bash
npm install -g @devicecloud/cli
```

## Basic Usage

Run tests with Device Cloud using either positional or named arguments:

```bash
# Using positional arguments
dcd cloud app.apk tests/

# Using named arguments (recommended)
dcd cloud --app-file app.apk --flows tests/
```

## Quick Examples

```bash
# Run single test
dcd cloud --app-file app.apk --flows login.yaml

# Run test directory
dcd cloud --app-file app.apk --flows tests/

# Run with device selection
dcd cloud --app-file app.apk --flows tests/ --android-device pixel-6

# Run with name for tracking
dcd cloud --app-file app.apk --flows tests/ --name "smoke-tests"
```

## Next Steps

- [Test Execution](features/test-execution.md) - Learn about test execution options
- [Device Configuration](devices/configuration.md) - Configure test devices
- [App Management](features/app-management.md) - Manage app binaries 