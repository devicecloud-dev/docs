# Run Priority

When your organisation is at its concurrency limit, new tests wait in a queue until a slot frees up. Run priority lets you choose which of your own queued runs starts first. For example, you can run release checks at `high` and a nightly regression suite at `low`.

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

* **Only your own runs are reordered.** Your organisation keeps exactly the same place in the shared queue that it would have had anyway. Priority only decides which of your runs uses each place, so a `high` run never starts earlier relative to other customers' runs. Every organisation gets the same flag, at no cost.
* **It only matters while you're at your limit.** Priority takes effect when your organisation is at its maximum concurrency and runs are waiting in the queue. Under the limit, nothing is held back, so there is nothing to reorder.
* **It applies across your concurrency pool.** If your organisation has a shared pool, shown in the console as **Standard — shared across iOS & Android**, iOS and Android runs draw on the same limit. A `high` iOS run can then start before your queued Android runs.
* **Retries keep the run's priority.** This covers both automatic retries from [`--retry`](../advanced/retry-strategies.md) and retries you queue from the console.

## What it doesn't do

* **It doesn't move you ahead of other customers.** Your place in the shared queue is the same at every priority.
* **It doesn't add concurrency.** Priority changes the order your queued runs start in, not how many run at once. To run more tests at the same time, increase your concurrency (see [Concurrency & Parallel Runs](../getting-started/concurrency-and-parallel-runs.md)).
* **It doesn't change billing.** A run costs the same at every priority.
* **It doesn't reorder tests already waiting for a device.** Priority applies while tests are held back by your own concurrency limit. A test that has already moved to pending, waiting for a free device, keeps its place.

## The 6-hour safeguard

A run that has been queued for more than 6 hours is started first, whatever its priority. A steady stream of `high` runs can delay your `low` runs, but can't hold them back indefinitely.

## CI integrations

{% tabs %}
{% tab title="GitHub Actions" %}
```yaml
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: build/app.apk
    priority: high
```

See the [`priority` input](../ci-cd/github-actions.md#execution-options).
{% endtab %}

{% tab title="Bitbucket" %}
```yaml
- pipe: docker://moropo/device-cloud-for-bitbucket:1.5.0
  variables:
    API_KEY: $DEVICE_CLOUD_API_KEY
    APP_FILE: 'build/app.apk'
    WORKSPACE: '.maestro'
    PRIORITY: 'high'
```

See the [pipe variables](../ci-cd/bitbucket-pipelines.md#variables).
{% endtab %}

{% tab title="Bitrise" %}
Set the step's `priority` input:

```yaml
- device-cloud-for-maestro@1:
    inputs:
    - api_key: $DEVICE_CLOUD_API_KEY
    - app_file: $BITRISE_APK_PATH
    - workspace: .maestro
    - priority: high
```
{% endtab %}

{% tab title="EAS Workflows" %}
The wrapper forwards CLI flags to `dcd cloud`, so add `--priority`:

```yaml
- run: |
    npx --yes @devicecloud.dev/eas-workflow@v1 \
      --app-file ${{ steps.download.outputs.artifact_path }} \
      --flows ./.maestro \
      --priority high
```

The same goes for any other wrapper that passes extra flags through to the CLI.
{% endtab %}

{% tab title="Any CI" %}
```bash
npx --yes @devicecloud.dev/dcd@latest cloud app.apk .maestro --priority high --api-key "$DEVICE_CLOUD_API_KEY"
```

See [Any CI](../ci-cd/any-ci.md).
{% endtab %}
{% endtabs %}

## AI agents

The [MCP server](../mcp/overview.md)'s `dcd_run_cloud_test` tool takes an optional `priority` parameter with the same values. See the [Tools Reference](../mcp/tools.md#dcd-run-cloud-test).
