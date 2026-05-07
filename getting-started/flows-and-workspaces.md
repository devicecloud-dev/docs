# Executing & Referencing Flows

There are multiple ways to execute flows from the CLI:

1. a single YAML flow
2. a directory of flows
3. flows that match a glob
4. flows specified in a workspace config file

### 1. Executing a single flow

The most straightforward way to execute a single flow is to pass the flow file path directly to the CLI using a `<flowFile>`.

```
dcd cloud --apiKey <apiKey> <appFile> <flowFile>
```

Where:

* `<appFile>` is one of:
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

* an absolute path, i.e. `/path/from/root`
* a relative path, i.e. `./` or `path/from/currentDir`

The CLI will inspect all YAML files in the directory (but not sub-directories) and create a test for each.

### 3. Executing flows by passing a glob

```
dcd cloud --apiKey <apiKey> <appFile> <glob>
```

Where `<glob>` is a path matching string such as `./**/*.yaml`

The CLI uses the [NPM glob](https://www.npmjs.com/package/glob) module. This package provides its own CLI which you can use for debugging globs.

### 4. Executing flows using a Workspace Config file

For complex setups, a `config.yaml` file is recommended. Place it in the top-level directory you pass to the CLI and it will be detected automatically.

```
dcd cloud --apiKey <apiKey> <appFile> <directoryPathIncludingConfigYaml>
```

See [Workspace Configuration](../configuration/workspace-config.md) for more information.

### Referencing flows

As of version 2.0.0, the CLI will search for all nested dependencies referenced by your YAML flows using Maestro keywords (`addMedia`, `runFlow`, `runScript`).
