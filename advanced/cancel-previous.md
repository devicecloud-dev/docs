# Cancelling superseded runs

Push twice in quick succession and the first run's queued tests are dead weight:
nobody is waiting on their verdict, but they still sit in the queue and still
cost you. `--cancel-previous` cancels them when the newer run is submitted.

It is opt-in and off by default. Without it, nothing about your runs changes.
Requires DeviceCloud CLI 5.6.0 or later.

## What it does

When a run carrying the flag is submitted, DeviceCloud looks for the previous
run from the same CI context and cancels the tests of that run which have not
started yet.

* **Both runs need the flag.** A run is only superseded if it was itself
  submitted with `--cancel-previous`.
* **Queued tests only.** Anything already running on a device finishes and
  reports normally — cancelling it would free no device and refund nothing.
* **Cancelled tests are refunded at 75%**, the same as cancelling a
  not-yet-started test by hand in the console.
* **The superseded run goes quiet.** It sends no completion email, Slack
  message or webhook, and its GitHub check, if it has one, is closed as
  `skipped` so it cannot block a pull request. `dcd cloud` exits `0` for it
  rather than failing your build; see
  [How a superseded run reports](#how-a-superseded-run-reports) for how each
  integration treats it.

## What counts as "the same CI context"

The context is built from three pieces of the run's metadata. Each tab under
[Usage](#usage) shows how to supply them.

| Part | Where it comes from |
|---|---|
| Repository | `gh_repo` |
| Branch or PR | `gh_pr_number` if present, otherwise `gh_branch` |
| Job | `gh_check_name` — the job's check name |

A pull request and a push to the same branch are **different** contexts, which
matches how GitHub Actions treats them.

If a run has no repository, or no branch and no PR, there is no context to group
by and nothing is cancelled. The run's output says so rather than guessing.

{% hint style="warning" %}
**Set a check name per job.** The check name is what keeps your iOS job from
cancelling your Android job. If one commit runs tests more than once and those
runs share a check name, they share a group — and the second will cancel the
first's queued tests. Without a check name, every job on the branch or PR
shares one group, and the submit output warns you.
{% endhint %}

Runs that report the **same** CI run ID never cancel each other, so jobs within
one CI run are safe even before you set check names. Where the run ID comes
from:

* **CLI:** `--metadata gh_run_id=<id>`. Without it, runs have no run ID.
* **EAS Workflows:** the EAS build ID, which differs between your iOS and
  Android build jobs, so those two jobs don't count as one run. Give each its
  own `DCD_CHECK_NAME`, or set the same `DCD_GH_RUN_ID` on both.

## Usage

`--cancel-previous` works with the CLI and with EAS Workflows. The GitHub
Action, the Bitrise step and the Bitbucket pipe don't have an option for it yet;
in those pipelines you can call the CLI directly, as below.

{% tabs %}
{% tab title="CLI" %}
```bash
dcd cloud --app-file build/app.apk --flows ./.maestro \
  --cancel-previous \
  --repo-name acme/my-app \
  --branch "$GIT_BRANCH" \
  --metadata gh_check_name=Android \
  --metadata gh_run_id="$CI_RUN_ID"
```

The CLI doesn't read your CI provider's environment, so pass the context
yourself. `--repo-name` plus `--branch` or `--pr-number` are required; without
them nothing is cancelled. `gh_check_name` scopes the group to this job, and
`gh_run_id` stops jobs of the same CI run from cancelling each other.
{% endtab %}

{% tab title="EAS Workflows" %}
```yaml
e2e_android:
  needs: [build_android]
  runs_on: linux-medium
  env:
    DCD_GH_REPO: acme/my-app       # your repository, as owner/repo
    DCD_GH_BRANCH: ${{ github.ref_name }}
    DCD_CHECK_NAME: Android        # a different value in each job
  steps:
    - uses: eas/checkout
    - id: download
      uses: eas/download_build
      with:
        build_id: ${{ needs.build_android.outputs.build_id }}
    - run: |
        npx --yes @devicecloud.dev/eas-workflow@v1 \
          --app-file ${{ steps.download.outputs.artifact_path }} \
          --flows ./.maestro \
          --cancel-previous
```

The wrapper passes `--cancel-previous` straight to the CLI and builds the
context from the job's `env:` block: `DCD_GH_REPO` plus `DCD_GH_BRANCH` or
`DCD_GH_PR_NUMBER` are required. Giving `DCD_GH_REPO` as a fixed string, as
above, keeps it valid on manual runs too. Instead of a check name per job, you
can set `DCD_GH_RUN_ID: ${{ workflow.id }}` on every job so the jobs of one
workflow run count as one run. See
[EAS Workflows](../ci-cd/eas-workflows.md#git-context-optional) for the
variables.
{% endtab %}
{% endtabs %}

## How a superseded run reports

The superseded run's CLI keeps waiting until any of its tests that were already
running have finished, then prints:

```
⚠ Run superseded by a newer run from the same CI context — exiting 0
  ⎿ superseded by   https://console.devicecloud.dev/results?upload=<newer upload id>
```

`dcd cloud` then exits `0`, even if one of the run's tests had already failed.
Under `--json`, `status` is `SUPERSEDED` — a third value alongside `PASSED` and
`FAILED`, so update any script that switches on it.

That value only comes from `dcd cloud` itself: `dcd status` and
[`GET /uploads/status`](../api/uploads.md) report a superseded run as `FAILED`,
because its cancelled tests count against it. So whether the older CI job goes
green depends on how you run the tests:

* **CLI:** the job passes, because `dcd cloud` exits `0`.
* **EAS Workflows:** the job still fails. The wrapper checks the run's status
  after the CLI exits, and that reports `FAILED`.

Each result cancelled this way carries a `cancellation_reason` of
`superseded_by:<upload id>` in [`GET /results/{uploadId}`](../api/results.md).

## Limitations

* It cannot stop a test that is already running on a device. A run whose tests
  had all started is unaffected.
* A re-run that reports the same CI run ID, such as GitHub's "Re-run failed
  jobs", does not supersede the original attempt.
* A previous run older than 24 hours is not superseded.
