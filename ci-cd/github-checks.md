# GitHub Checks

Install the DeviceCloud GitHub App and every test run posts a pass/fail check on the pull request that started it. It works best with the Action's [`async`](github-actions.md#execution-options) mode where your workflow submits the run and exits after a few seconds, we run the tests on our own devices, and the result will land on the PR when it's ready. Nothing sits waiting on a runner, so you're not burning CI minutes while the tests execute.

{% hint style="info" %}
You do not need to install our Checks app to use the GitHub Action, but you do need the GitHub Action to use Checks.
{% endhint %}

## How it works

The Action submits your tests and either polls for results or if you set `async: true`, returns straight away. DeviceCloud posts an in-progress check against the PR's commit and updates it to passed or failed once every flow has finished. The check links back to the full run in the console, and because it's an ordinary GitHub check you can require it in branch protection to keep failing builds out of your main branch.

## Connect the App

Open **Settings → Integrations** in the [console](https://console.devicecloud.dev/settings) and click **Connect GitHub**. GitHub asks you to authorize DeviceCloud, and what happens next depends on whether you already have the App:

- **First time.** GitHub sends you on to install the App and choose which repositories it can see. Once you're done you land back on the Integrations page, connected to your current team.
- **Already installed** (on another team, or you removed the connection earlier). We reconnect to your existing installation and return you straight to the console — no reinstall, and no repository step. Your existing repository selection carries over; change it any time with **Manage repositories on GitHub** on the Integrations card.

If you have the App installed on more than one GitHub account or organization, we'll ask which one to connect.

A few things worth knowing:

- Only owners and admins can connect GitHub for a team.
- Your GitHub account needs to be linked to DeviceCloud first, under **Settings → Account**. This is separate from installing the App — it's how we know which DeviceCloud account an installation belongs to.
- If you're an admin on more than one team, you may be asked which one to connect if we can't figure it out automatically using account context.

## Choosing which repositories

Checks only post on repositories the App can access. **Settings → Integrations** shows the current scope — either *All repositories* or a count of selected ones — with a **Manage repositories on GitHub** link that opens the installation's settings, where you can add or remove repositories.

Changes take effect immediately; we track GitHub's repository events, so the console reflects the new scope without you reconnecting.

## Run your tests

Run the [Action](github-actions.md) on your pull requests with `async: true`. It attaches the branch, commit, and PR number for you, which is how DeviceCloud knows where to post the check, so ensure you do not disable [`include-github-context`](github-actions.md#github--pr-context) (it's enabled by default).

```yaml
on:
  pull_request:
    branches: [main]

jobs:
  mobile-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # build your app, or download a prebuilt artifact from an earlier job
      - uses: devicecloud-dev/device-cloud-for-maestro@v2
        with:
          api-key: ${{ secrets.DCD_API_KEY }}
          app-file: app/build/outputs/apk/release/app-release.apk
          async: true
```

## Require it before merging

To make the check a merge gate, add it to a branch protection rule: your repo's **Settings → Branches → Require status checks to pass**, then pick **DeviceCloud**. GitHub only lists a check here after it's run at least once, so open a pull request before you set up the rule.

## Re-running failures

A failed check has a **Re-run failed tests** button. It re-runs only the flows that failed and is completely free, just like retries from the CI. It'll move the check back to in-progress until they finish.

## What the check shows

The pass/fail count and total runtime. Below that, a table of every flow with its result, the reason for anything that failed, and a link into the console for the logs, video, and screenshots.

## Managing the connection

**Settings → Integrations** shows the connected account and the repositories the App can reach. Owners and admins can disconnect from there, which always removes the connection and stops the checks. We also try to uninstall the App from GitHub as part of that — if we can't, the console says so and links you to remove it yourself. You can uninstall from your GitHub settings at any time regardless.

If you reconnect later, DeviceCloud picks up your existing installation instead of making you install again.

## When a check doesn't show up

Usually it's one of these:

- **Nothing posts on the PR.** The App isn't installed on that repo, isn't connected to your team, or the run used a different team's API key. Check **Settings → Integrations**, and confirm the repo is in scope under **Manage repositories on GitHub**.
- **Connect GitHub lands on a GitHub 404.** That's a configuration problem on our side, not yours — nothing you can change will fix it. Get in touch and we'll sort it.
- **The check is stuck in progress.** The run probably hasn't finished yet. Look it up in the console; the check only resolves once every flow reaches a final state.
- **"That GitHub account isn't linked."** Link your GitHub identity under **Settings → Account**, then connect.
- **The check isn't in the branch-protection list.** It has to run once on the repo before GitHub will offer it. Open a pull request first.

---

See also [GitHub Actions](github-actions.md) and [Async Execution](../advanced/async-execution.md).
