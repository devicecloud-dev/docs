# Executing & Referencing flows

There are two main ways to execute flows from the cli;

1. Executing a file
2. Executing a directory, based on a [#workspace-configuration](executing-and-referencing-flows.md#workspace-configuration "mention") file.

## Executing a single flow

The most simplistic way of executing a flow file is to call the flow directory from the cli explicitly using a `<flowFile>`.

```
dcd cloud --apiKey <apiKey> <appFile> <flowFile>
```

Where;

* `<appFile>` is one of;&#x20;
  * `.app`
  * `.app.zip`
  * `.zip`
  * `.apk`
* `<flowFile>` is one of;
  * `.yaml`
  * `.yml`

## Executing a directory of flows

You can execute a directory of flows by specifying a directory path instead of an individual file, the cli will execute tests as defined by the rules in the [#workspace-configuration](executing-and-referencing-flows.md#workspace-configuration "mention") file, `config.yaml`, in the working directory. This can be an absolute or relative directory path.&#x20;

```
dcd cloud --apiKey <apiKey> <appFile> <directoryPath>
```

Where;

* `<directoryPath>` is either an;
  * absolute path. i.e. `/path/from/root`
  * relative path, i.e. `./` or `path/from/currentDir`

### Workspace Configuration

For executing a directory of flows a workspace configuration file, `config.yaml` should be used. This file is explained in detail in the [Maestro Cloud documentation](https://cloud.mobile.dev/reference/workspace-configuration). We only supported the Maestro configuration options listed below. A `config.yaml` containing unsupported configuration will be processed, but unsupported config options ignored.

{% hint style="info" %}
If no `config.yaml` file is found, all flows matching `.yaml` in the working directory (and any subfolders) will be executed.
{% endhint %}

#### Supported Config

* `flows`
* `includeTags`
* `excludeTags`
* `executionOrder`

#### Unsupported Config

* `baselineBranch`
* `notifications`
* `disableRetries`

### Referencing flows&#x20;

Referenced files will only be matched down directory levels from the working directory, we do not support referencing files outside of a recursive search of the current working directory.&#x20;

#### Valid workspace configuration

In the below example, referencing `subflow.yaml` from `flow.yaml` will work, as they are both contained within the working directory.

```
<working directory>
│── flows/
│   │── subflows/
│   │   │── subflow.yaml
│   │
│   │── flow.yaml
```

#### Invalid workspace configuration

In the below case if `flow.yaml` referenced `subflow.yaml`, which is outside the working directory, the flow would fail to execute.

```
│── subflows/
│   │── subflow.yaml
│
│── <working directory>
│   │── flows
│   │   │── flow.yaml
```

