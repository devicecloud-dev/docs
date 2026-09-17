# Cancelling superseded runs

Push twice in quick succession and the first run's queued tests are dead weight:
nobody is waiting on their verdict, but they still sit in the queue and still
cost you. `--cancel-previous` cancels them when the newer run is submitted.

It is opt-in and off by default. Without it, nothing about your runs changes.

## What it does

When a run carrying the flag is submitted, DeviceCloud looks for the previous
run from the same CI context and cancels the tests of that run which have not
started yet.

* **Queued tests only.** Anything already running on a device finishes and
  reports normally — cancelling it would free no device and refund nothing.
* **Cancelled tests are refunded at 75%**, the same as cancelling a
  not-yet-started test by hand in the console.
* **The superseded run exits 0** instead of failing your build, and says so in
  its output. It sends no completion email or webhook, and its GitHub check is
  closed as `skipped` so it cannot block a pull request.

## What counts as "the same CI context"

The context is derived from the metadata your CI integration already attaches:

| Part | Where it comes from |
|---|---|
| Repository | `gh_repo`, or `bb_repo` on Bitbucket |
| Branch or PR | `gh_pr_number` if present, otherwise `gh_branch` (`bb_` twins on Bitbucket) |
| Job | `gh_check_name` — the check name your integration passes |

A pull request and a push to the same branch are **different** contexts, which
matches how GitHub Actions treats them.

If a run has no repository, or no branch and no PR, there is no context to group
by and nothing is cancelled. The run's output says so rather than guessing.

{% hint style="warning" %}
**Set a check name per job.** The check name is what keeps your iOS job from
cancelling your Android job. If one commit runs tests more than once and those
runs share a check name, they share a group — and the second will cancel the
first's queued tests.
{% endhint %}

Runs from the **same** CI run never cancel each other, so a job matrix is safe
even before you set check names. Bitrise is the exception: it reports no build
id, so two `dcd cloud` invocations in one Bitrise build need distinct check
names.

## Usage

{% tabs %}
{% tab title="GitHub Actions" %}
```yaml
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: build/app.apk
    cancel-previous: true
    check-name: Android
```
{% endtab %}

{% tab title="CLI" %}
```bash
dcd cloud --app-file build/app.apk --flows ./.maestro --cancel-previous
```

Outside CI this does nothing: there is no repository or branch metadata to
derive a context from.
{% endtab %}

{% tab title="Bitbucket" %}
```yaml
- pipe: docker://moropo/device-cloud-for-bitbucket:latest
  variables:
    API_KEY: $DCD_API_KEY
    APP_FILE: build/app.apk
    CANCEL_PREVIOUS: "true"
    CHECK_NAME: Android
```
{% endtab %}

{% tab title="Bitrise" %}
Set the **Cancel Previous Run** input (`cancel_previous`) to `true`, and give
each invocation its own **GitHub Check Name** (`check_name`) if a build runs the
step more than once.
{% endtab %}

{% tab title="EAS Workflows" %}
```yaml
- run: |
    npx --yes @devicecloud.dev/eas-workflow@v1 \
      --app-file ${{ steps.download.outputs.artifact_path }} \
      --flows ./.maestro \
      --cancel-previous
```
{% endtab %}
{% endtabs %}

## How a superseded run reports

The superseded run's CLI stops as soon as its tests are cancelled and prints:

```
! Run superseded by a newer run from the same CI context — exiting 0
```

It exits `0`, so the older CI job goes green rather than red. Under `--json`,
`status` is `SUPERSEDED` — a third value alongside `PASSED` and `FAILED`, so
update any script that switches on it.

Each result cancelled this way carries a `cancellation_reason` of
`superseded_by:<upload id>`, visible in the console and in
[`GET /results/{uploadId}`](../api/results.md).

## Limitations

* It cannot stop a test that is already running on a device. A run whose tests
  had all started is unaffected.
* GitHub's "Re-run failed jobs" reuses the same run id, so a re-run does not
  supersede the original attempt.
* A previous run older than 24 hours is not superseded.
