# Executing & Referencing Flows

There are multiple ways to execute flows from the CLI:

1. a single YAML flow
2. a directory of flows
3. flows specified in a workspace config file

### 1. Executing a single flow

The most straightforward way to execute a single flow is to pass the flow file path directly to the CLI using a `<flowFile>`.

```
dcd cloud <appFile> <flowFile>
```

Where:

* `<appFile>` is one of:
  * `.app`
  * `.zip`
  * `.apk`
  * `.tar.gz` (an Expo iOS build)
* `<flowFile>` is one of:
  * `.yaml`
  * `.yml`

### 2. Executing flows by passing a directory

```
dcd cloud <appFile> <directoryPath>
```

Where `<directoryPath>` is either:

* an absolute path, i.e. `/path/from/root`
* a relative path, i.e. `./` or `path/from/currentDir`

The CLI will inspect all YAML files at the top level of the directory (sub-directories are not scanned) and create a test for each. To pick up flows in sub-directories, use `flows` glob patterns in a workspace config file (see below).

{% hint style="warning" %}
The CLI takes a single flow path, not a glob. A quoted glob such as `"./**/*.yaml"` fails because no file has that name, and an unquoted glob is expanded by your shell into several paths, of which only the first is used. Put glob patterns in the `flows` field of a workspace config file instead.
{% endhint %}

### 3. Executing flows using a Workspace Config file

For complex setups, a `config.yaml` file is recommended. Place it in the top-level directory you pass to the CLI and it will be detected automatically. Its `flows` field accepts glob patterns such as `./**/*.yaml`, so you can select flows in sub-directories.

```
dcd cloud <appFile> <directoryPathIncludingConfigYaml>
```

See [Workspace Configuration](../configuration/workspace-config.md) for more information.

### Referencing flows

As of version 2.0.0, the CLI will search for all nested dependencies referenced by your YAML flows using Maestro keywords (`addMedia`, `runFlow`, `runScript`).
