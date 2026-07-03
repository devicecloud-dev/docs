# GitHub Checks

The DeviceCloud GitHub App posts a pass/fail **check** on your pull requests when a test run finishes. Paired with the GitHub Action's [`async`](github-actions.md#execution-options) mode, this lets you run your mobile E2E suite **fully asynchronously** — your CI job submits the run and exits in seconds, while DeviceCloud runs the tests and reports the result straight back on the pull request.

The payoff: your PRs get a real pass/fail gate from your mobile tests **without a CI runner sitting idle** waiting for them to finish — so you spend a fraction of the CI minutes.

{% hint style="info" %}
GitHub Checks are optional and complement the [GitHub Action](github-actions.md). If you don't install the App, the Action behaves exactly as before — blocking or `async`, your choice.
{% endhint %}

## How it works

1. Your GitHub Action submits a run with `async: true` and exits immediately — the CI job is done in seconds.
2. DeviceCloud posts an **in-progress** check on the pull request's commit.
3. When the run completes, the check resolves to **success** or **failure**, with a summary of every flow, the failures, and a link to the full results in the console.
4. Because it's a native GitHub check, you can **require it in branch protection** to gate merges.

## Setup

### 1. Install & connect the DeviceCloud GitHub App

In the [console](https://console.devicecloud.dev/settings), open **Settings → Integrations → Connect GitHub**. You'll be sent to GitHub to install the **DeviceCloud** App and choose which repositories it can access. When you come back, the App is connected to your current team.

{% hint style="info" %}
Only team **owners and admins** can connect GitHub. If your GitHub account isn't linked to DeviceCloud yet, link it under **Settings → Account** first, then connect.
{% endhint %}

If you administer more than one DeviceCloud team, you'll be asked which team to attach the installation to.

### 2. Run the Action with `async`

Run the [GitHub Action](github-actions.md) on your pull requests with `async: true`. The PR context (branch, commit SHA, PR number) is attached automatically, so DeviceCloud knows which pull request to post the check on.

```yaml
on:
  pull_request:
    branches: [main]

jobs:
  mobile-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # build your app, or download a prebuilt artifact from an earlier job...
      - uses: devicecloud-dev/device-cloud-for-maestro@v2
        with:
          api-key: ${{ secrets.DCD_API_KEY }}
          app-file: app/build/outputs/apk/release/app-release.apk
          async: true
```

The job submits and exits in seconds, and the DeviceCloud check appears on the PR — resolving to pass/fail when the run finishes.

{% hint style="warning" %}
The check only posts when DeviceCloud can tie the run to a repository the App is installed on. Keep [`include-github-context`](github-actions.md#github--pr-context) at its default (`true`) so the PR and commit metadata are attached, and make sure the Action's `api-key` belongs to the same team the App is connected to.
{% endhint %}

### 3. (Optional) Require the check to gate merges

To block merges on the result, add the check to your branch protection rule:

**GitHub → your repository → Settings → Branches → Add/Edit branch protection rule → Require status checks to pass before merging** — then select the **DeviceCloud** check.

{% hint style="info" %}
A check only appears in the branch-protection picker after it has run at least once on that repository. Open one pull request first, then add it to the rule.
{% endhint %}

## Re-running failed tests

When a check fails it includes a **Re-run failed tests** button. Pressing it re-runs only the failed flows on DeviceCloud — free, exactly like the retry button in the console — and re-opens the check, which resolves again when the reruns finish. GitHub's built-in **Re-run** on the check does the same thing.

## The check summary

A resolved check shows:

- A headline with the pass/fail count and total duration.
- A table of every flow and its result.
- A **Failures** section listing the reason for each failed flow.
- A link to the full run — logs, video, and screenshots — in the DeviceCloud console.

## Managing the connection

From **Settings → Integrations** you can see the connected GitHub account and the repositories the App can access, and **Disconnect** at any time (owner/admin only). Disconnecting uninstalls the App from GitHub and stops posting checks; you can reconnect whenever you like — the App recovers your existing installation without a fresh install.

## Requirements

- The repository is hosted on GitHub and has the **DeviceCloud** App installed.
- The App is connected to the DeviceCloud team that owns the `api-key` used by the Action.
- The run carries PR/commit context — on by default via the Action's [`include-github-context`](github-actions.md#github--pr-context).

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| No check appears on the PR | Confirm the DeviceCloud App is **installed on the repo** and **connected to your team** (Settings → Integrations), and that the run used that team's API key. |
| Check stays "in progress" | The run is likely still executing — check the console. The check resolves once every flow reaches a terminal state. |
| "That GitHub account isn't linked" when connecting | Link your GitHub identity under **Settings → Account**, then connect. |
| The check isn't listed in branch protection | It only appears after it has run once on that repository. Open a pull request first. |

---

**Related:** [GitHub Actions](github-actions.md) · [Async Execution](../advanced/async-execution.md)
