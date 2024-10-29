# Executing & Referencing flows

There are multiple ways to execute flows from the CLI:

1. a single YAML flow;
2. a directory of flows;
3. flows that match a glob.
4. flows specified in a [#workspace-configuration](executing-and-referencing-flows.md#workspace-configuration "mention") file.

### 1. Executing a single flow

The most simplistic way of executing a flow file is to call the flow directory from the CLI explicitly using a `<flowFile>`.

```
dcd cloud --apiKey <apiKey> <appFile> <flowFile>
```

Where:

* `<appFile>` is one of:&#x20;
  * `.app`
  * `.zip`
  * `.apk`
* `<flowFile>` is one of:
  * `.yaml`
  * `.yml`

### 2. Executing flows by passing a directory

```
dcd cloud --apiKey <apiKey> <appFile> <directoryPath>
```

Where `<directoryPath>` is either:

* an absolute path. i.e. `/path/from/root`
* a relative path, i.e. `./` or `path/from/currentDir`

In this case, the CLI will inspect all YAML files in the directory (but not sub-directories) and create new tests for each. Note: if the specified directory contains a `config.yaml` folder, then the CLI will switch to using the workspace configuration.

### 3. Executing flows by passing a glob

```
dcd cloud --apiKey <apiKey> <appFile> <glob>
```

Where `<glob>`is path matching string such as `./**/*.yaml`

The CLI uses the [NPM glob](https://www.npmjs.com/package/glob) module. This package provides its own CLI which you can use for debugging globs.

### 4. Executing flows using a Workspace Config file

```
dcd cloud --apiKey <apiKey> <appFile> <directoryPathIncludingConfigYaml>
```

To use a Workspace Config file (`config.yaml`), include it in the top-level directory. The CLI will inspect this file and match flows by name or glob using the `flows` key.

### Workspace Config

For complex setups a `config.yaml` file is recommended. This file is explained in detail in the [Maestro Cloud documentation](https://cloud.mobile.dev/reference/workspace-configuration). We only supported the Maestro configuration options listed below. A `config.yaml` containing unsupported configuration will be processed, but unsupported config options will be skipped.

#### Supported Config

* `flows`
* `includeTags`
* `excludeTags`
* `executionOrder`
* `notifications` (see [email-notifications.md](../reference/email-notifications.md "mention"))

#### Unsupported Config

* `baselineBranch`
* `disableRetries`

### Referencing flows&#x20;

As of version 2.0.0, the CLI will search for all nested dependencies referenced by your YAML flows using Maestro keywords (`addMedia`, `runFlow`, `runScript`)



