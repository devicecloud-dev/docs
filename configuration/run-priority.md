# Run Priority

When your team is at its concurrency limit, new tests wait in a queue until a slot frees up. Run priority lets you choose which of your own queued runs starts first. For example, you can run release checks at `high` and a nightly regression suite at `low`.

Priority is set per run with `--priority`. A run without it is `normal`, so nothing changes unless you set it.

## Usage

```bash
dcd cloud app.apk flows/ --priority high
```

| Level | Starts |
|-------|--------|
| `high` | Before your queued `normal` and `low` runs |
| `normal` | The default. Before your queued `low` runs |
| `low` | After your queued `high` and `normal` runs |

The priority applies to the whole run: every flow in that `dcd cloud` run gets the same priority.

## How it works

Once you reach your maximum concurrency, extra tests are queued until you're back under your limit (see [Concurrency & Parallel Runs](../getting-started/concurrency-and-parallel-runs.md)). Each time a slot frees up, your queued `high` tests start first, then `normal`, then `low`.

* Priority takes effect when your team is at its maximum concurrency and runs are waiting in the queue. When you're under the limit, nothing is held back, so there is nothing to reorder.
* [Retries](../advanced/retry-strategies.md), from `--retry` or the console, keep the original run's priority.
* In an `executionOrder` sequence, priority only decides when the first flow starts. Each later flow in the sequence can start once the one before it finishes.
* Priority reorders your queued runs within each device. If a higher-priority run on one device takes the slot your queued run on another device would have used, that run goes back in its device's queue as if you had just submitted it.

## FAQ

### Are priority runs charged any differently?
No.

### Do priority tests affect other teams and their tests?
No, priority is scoped to only your team's queue.

### What happens to low runs that get bumped continuously?
A run that has been queued for more than 6 hours is started first, no matter its priority. A steady stream of `high` runs can delay your `low` runs, but can't hold them back indefinitely.

## CI integrations

::::tabs
== GitHub Actions
```yaml
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: build/app.apk
    priority: high
```

See the [`priority` input](../ci-cd/github-actions.md#execution-options).

== Bitbucket
```yaml
- pipe: docker://moropo/device-cloud-for-bitbucket:1.6.1
  variables:
    API_KEY: $DEVICE_CLOUD_API_KEY
    APP_FILE: 'build/app.apk'
    WORKSPACE: '.maestro'
    PRIORITY: 'high'
```

See the [pipe variables](../ci-cd/bitbucket-pipelines.md#variables).

== Bitrise
Set the step's `priority` input:

```yaml
- device-cloud-for-maestro@1:
    inputs:
    - api_key: $DEVICE_CLOUD_API_KEY
    - app_file: $BITRISE_APK_PATH
    - workspace: .maestro
    - priority: high
```

== EAS Workflows
The wrapper forwards CLI flags to `dcd cloud`, so add `--priority`:

```yaml
- run: |
    npx --yes @devicecloud.dev/eas-workflow@v1 \
      --app-file ${{ steps.download.outputs.artifact_path }} \
      --flows ./.maestro \
      --priority high
```

The same goes for any other wrapper that passes extra flags through to the CLI.

== Any CI
```bash
npx --yes @devicecloud.dev/dcd@latest cloud app.apk .maestro --priority high --api-key "$DEVICE_CLOUD_API_KEY"
```

See [Any CI](../ci-cd/any-ci.md).
::::

## AI agents

The [MCP server](../mcp/connect.md)'s `dcd_run_cloud_test` tool takes an optional `priority` parameter with the same values. See the [Cloud Test Tools](../mcp/tools.md#dcd-run-cloud-test).
