# GitHub Checks

Install the DeviceCloud GitHub App and every test run posts a pass/fail check on the pull request that started it. It works best with the Action's [`async`](github-actions.md#execution-options) mode: your workflow submits the run and exits after a few seconds, DeviceCloud runs the tests on its own devices, and the result lands on the PR when it's ready. Nothing sits waiting on a runner, so you're not burning CI minutes while the tests execute.

It's optional. Skip the App and the Action behaves exactly as it does today.

## How it works

The Action submits your tests and, with `async: true`, returns straight away. DeviceCloud posts an in-progress check against the PR's commit and updates it to passed or failed once every flow has finished. The check links back to the full run in the console, and because it's an ordinary GitHub check you can require it in branch protection to keep failing builds out of your main branch.

## Connect the App

Open **Settings → Integrations** in the [console](https://console.devicecloud.dev/settings) and click **Connect GitHub**. GitHub walks you through installing the App and choosing which repositories it can see; when you come back, it's connected to your current team.

A few things worth knowing:

- Only owners and admins can connect GitHub for a team.
- Your GitHub account needs to be linked to DeviceCloud first, under **Settings → Account**. If it isn't, the connect flow will say so.
- If you're an admin on more than one team, you'll be asked which one to connect.

## Run your tests

Run the [Action](github-actions.md) on your pull requests with `async: true`. It attaches the branch, commit, and PR number for you, which is how DeviceCloud knows where to post the check, so leave [`include-github-context`](github-actions.md#github--pr-context) on (it already is by default).

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

The one thing to get right: the `api-key` you pass has to belong to the same team the App is connected to. If it doesn't, DeviceCloud can't match the run to your installation and nothing gets posted.

## Require it before merging

To make the check a merge gate, add it to a branch protection rule: your repo's **Settings → Branches → Require status checks to pass**, then pick **DeviceCloud**. GitHub only lists a check here after it's run at least once, so open a pull request before you set up the rule.

## Re-running failures

A failed check has a **Re-run failed tests** button. It re-runs only the flows that failed (free, the same as hitting retry in the console) and moves the check back to in-progress until they finish. GitHub's own re-run button on the check does the same thing.

## What the check shows

At the top, the pass/fail count and total runtime. Below that, a table of every flow with its result, the reason for anything that failed, and a link into the console for the logs, video, and screenshots.

## Managing the connection

**Settings → Integrations** shows the connected account and the repositories the App can reach. Owners and admins can disconnect from there, which removes the App from GitHub and stops the checks. If you reconnect later, DeviceCloud picks up your existing installation instead of making you install again.

## When a check doesn't show up

Usually it's one of these:

- **Nothing posts on the PR.** The App isn't installed on that repo, isn't connected to your team, or the run used a different team's API key. Check **Settings → Integrations**.
- **The check is stuck in progress.** The run probably hasn't finished yet. Look it up in the console; the check only resolves once every flow reaches a final state.
- **"That GitHub account isn't linked."** Link your GitHub identity under **Settings → Account**, then connect.
- **The check isn't in the branch-protection list.** It has to run once on the repo before GitHub will offer it. Open a pull request first.

---

See also [GitHub Actions](github-actions.md) and [Async Execution](../advanced/async-execution.md).
