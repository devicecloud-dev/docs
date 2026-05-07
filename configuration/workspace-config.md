# Workspace Configuration

A `config.yaml` (or `config.yml`) file lets you configure how the CLI discovers, filters, and runs your flows without needing to pass every option on the command line. It is recommended for any project with more than a handful of flows.

## Auto-detection

Place `config.yaml` at the root of the directory you pass to `dcd cloud`. The CLI picks it up automatically — no extra flag required.

```bash
dcd cloud app.apk flows/        # flows/config.yaml is loaded automatically
```

## Custom path

Use `--config` to load a config file from a non-standard location:

```bash
dcd cloud app.apk flows/ --config ci/workspace.yaml
```

## Fields

### `flows`

Glob patterns that select which flow files to run. Accepts a list of patterns; the CLI uses the [NPM glob](https://www.npmjs.com/package/glob) module.

```yaml
flows:
  - ./**/*.yaml        # all YAML files recursively
  - ./smoke/*.yaml     # only files inside smoke/
```

Files named `config.yaml` / `config.yml` and paths containing `.app` path segments are always excluded regardless of the pattern.

If `flows` is omitted, all `.yaml` / `.yml` files in the directory (except config files) are included.

### `includeTags` / `excludeTags`

Filter flows by their Maestro `tags`. Values here are **merged** with any `--include-tags` / `--exclude-tags` CLI flags — both sets apply simultaneously.

```yaml
includeTags:
  - smoke
excludeTags:
  - slow
  - wip
```

### `executionOrder`

Run a subset of flows sequentially (in order) before the remaining flows run in parallel.

```yaml
executionOrder:
  continueOnFailure: false
  flowsOrder:
    - login         # matches flow with name: "login" or file login.yaml
    - checkout
    - payment
```

- `flowsOrder` — list of flow names to run in sequence. A name matches either the `name:` field inside the flow YAML or the filename without extension.
- `continueOnFailure` — if `true`, subsequent flows in the sequence run even if an earlier one fails. Defaults to `false`.

{% hint style="info" %}
If a flow name in `flowsOrder` doesn't match any discovered flow (e.g. after tag filtering), the CLI emits a warning and lists the available names to help diagnose the mismatch.
{% endhint %}

### `notifications`

Send email notifications when a run completes. See [Notifications](../test-results/notifications.md) for full context.

```yaml
notifications:
  email:
    enabled: true
    onSuccess: false   # set to true to also notify on passing runs
    recipients:
      - team@example.com
      - ci-alerts@example.com
```

### `platform`

Per-platform settings. Currently supports disabling animations, which is equivalent to passing `--disable-animations` on the CLI but lets you control each platform independently. The CLI flag takes precedence if both are set.

```yaml
platform:
  android:
    disableAnimations: true   # disables system animation scales
  ios:
    disableAnimations: true   # enables Reduce Motion on the simulator
```

## Full example

```yaml
flows:
  - ./**/*.yaml

includeTags:
  - smoke

excludeTags:
  - wip

executionOrder:
  continueOnFailure: false
  flowsOrder:
    - login
    - onboarding

notifications:
  email:
    enabled: true
    onSuccess: false
    recipients:
      - team@example.com

platform:
  android:
    disableAnimations: true
  ios:
    disableAnimations: true
```
