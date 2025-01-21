# Flow Selection

Device Cloud provides flexible options for selecting which Maestro flows to run.

## Basic Flow Selection

### Single Flow File
```bash
dcd cloud --flows path/to/flow.yaml
```

### Directory of Flows
```bash
dcd cloud --flows path/to/flows/
```

## Flow Filtering

### Using Tags
Tags help organize and select specific flows to run.

#### Including Tags
Run only flows with specific tags:
```bash
dcd cloud --include-tags smoke-test regression
```

#### Excluding Tags
Skip flows with specific tags:
```bash
dcd cloud --exclude-tags slow long-running
```

#### Combining Tag Filters
Use both include and exclude:
```bash
dcd cloud --include-tags regression --exclude-tags slow
```

### Excluding Directories
Skip specific subdirectories:
```bash
dcd cloud --exclude-flows tests/experimental tests/deprecated
```
