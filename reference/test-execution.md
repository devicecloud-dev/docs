# Test Execution

Run Maestro flows on Device Cloud.

## Basic Usage

```bash
# Simple run
dcd cloud --app-file ./app.apk --flows ./tests/

# Named run
dcd cloud --name "smoke-tests" --app-file ./app.apk --flows ./tests/
```

## Execution Modes

### Sync (Default)

* Blocks until completion
* Shows real-time progress
* Returns results immediately

### Async

```bash
dcd cloud ... --async --name "nightly" 
```

* Returns immediately
* Continues in background
* Check dashboard for results

## Test Selection

```bash
# Single flow
dcd cloud ... --flows login.yaml

# Directory
dcd cloud ... --flows smoke/

# By tags
dcd cloud ... --include-tags smoke,critical
dcd cloud ... --exclude-tags slow
```

## Options

### Output

```bash
# Quiet mode
dcd cloud ... -q

# Generate reports
dcd cloud ... --report junit
```

### Retry & Environment

```bash
# Retry failed tests
dcd cloud ... --retry 3

# Set variables
dcd cloud ... -e API_URL=https://test-api.com
```

### Binary Management

```bash
# Multiple apps
dcd cloud --app-file main.apk --additional-app-files helper.apk ...

# Using IDs
dcd cloud --app-binary-id abc123 ...
```

### Device Selection

```bash
# Android
dcd cloud ... --android-device pixel-6 --android-api-level 33

# iOS
dcd cloud ... --ios-device iphone-15 --ios-version 17
```
