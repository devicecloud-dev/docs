# GitHub Checks

Install the DeviceCloud GitHub App and every test run posts a pass/fail check on the pull request that started it. It works best with the Action's [`async`](github-actions.md#execution-options) mode where your workflow submits the run and exits after a few seconds, we run the tests on our own devices, and the result will land on the PR when it's ready. Nothing sits waiting on a runner, so you're not burning CI minutes while the tests execute.

{% hint style="info" %}
You do not need to install our Checks app to use the GitHub Action, but you do need the GitHub Action to use Checks.
{% endhint %}

## How it works

The Action submits your tests and either polls for results or if you set `async: true`, returns straight away. DeviceCloud posts an in-progress check against the PR's commit and updates it to passed or failed once every flow has finished. The check links back to the full run in the console, and because it's an ordinary GitHub check you can require it in branch protection to keep failing builds out of your main branch.

## Connect the App

Open **Settings → Integrations** in the [console](https://console.devicecloud.dev/settings) and click **Connect GitHub**. GitHub walks you through installing the App and choosing which repositories it can see; when you come back, it's connected to your current team.

A few things worth knowing:

- Only owners and admins can connect GitHub for a team.
- Your GitHub account needs to be linked to DeviceCloud first, under **Settings → Account**.
- If you're an admin on more than one team, you may be asked which one to connect if we can't figure it out automatically using account context.

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

**Settings → Integrations** shows the connected account and the repositories the App can reach. Owners and admins can disconnect from there, which removes the App from GitHub and stops the checks. If you reconnect later, DeviceCloud picks up your existing installation instead of making you install again. You can also remove the App from your GitHub settings.

## When a check doesn't show up

Usually it's one of these:

- **Nothing posts on the PR.** The App isn't installed on that repo, isn't connected to your team, or the run used a different team's API key. Check **Settings → Integrations**.
- **The check is stuck in progress.** The run probably hasn't finished yet. Look it up in the console; the check only resolves once every flow reaches a final state.
- **"That GitHub account isn't linked."** Link your GitHub identity under **Settings → Account**, then connect.
- **The check isn't in the branch-protection list.** It has to run once on the repo before GitHub will offer it. Open a pull request first.

---

See also [GitHub Actions](github-actions.md) and [Async Execution](../advanced/async-execution.md).
