# GitHub Checks

Install the DeviceCloud GitHub App and every test run posts a pass/fail check on the pull request that started it. It works best with the Action's [`async`](github-actions.md#execution-options) mode. Your workflow submits the run and exits after a few seconds, our devices run the tests, and the result lands on the PR when it's ready. Nothing waits on a runner, so you don't spend CI minutes while the tests run.

::: info
You do not need to install our Checks app to use the GitHub Action, and you don't need the Action to use Checks: any run that carries `gh_repo` and `gh_sha` metadata posts a check. The Action attaches these for you; elsewhere you pass them yourself, see [Any CI](any-ci.md), [Bitrise](bitrise-steps.md), [Bitbucket Pipelines](bitbucket-pipelines.md) and [EAS Workflows](eas-workflows.md).
:::

## How it works

The Action submits your tests. Without `async: true` it waits for the results; with it, it returns straight away. DeviceCloud posts an in-progress check on the PR's commit and updates it to passed or failed once every flow has finished. The check links back to the full run in the console. Because it's an ordinary GitHub check, you can require it in branch protection to keep failing builds out of your main branch.

If a newer run replaces this one through [`cancel-previous`](../advanced/cancel-previous.md), DeviceCloud closes this run's check as `skipped`, so it can't block the PR.

## Connect the App

Open **Settings → Integrations** in the [console](https://console.devicecloud.dev/settings?section=integrations) and click **Connect GitHub**. GitHub asks you to authorise DeviceCloud, and what happens next depends on whether you already have the App:

- **First time.** GitHub sends you on to install the App and choose which repositories it can see. Once you're done you land back on the Integrations page, connected to your current team.
- **Already installed** (for example, you installed it from the App's page on GitHub first). We connect your team to that installation and return you straight to the console, with no reinstall and no repository step. Your existing repository selection carries over; change it any time with **Manage repositories on GitHub** on the Integrations card.

If you have the App installed on more than one GitHub account or organization, we'll ask which one to connect.

An installation can be connected to one DeviceCloud team at a time. To move it to another team, disconnect it from the first team, then connect from the new one. Disconnecting also uninstalls the App from that GitHub account or organization, so the new team goes through the install step again (see [Managing the connection](#managing-the-connection)).

The App (**DeviceCloud for GitHub**) asks for two repository permissions: **Checks** (read and write), to post and update checks, and **Metadata** (read-only), which GitHub requires for every App. It subscribes to check run events so the **Re-run failed tests** button works.

A few things worth knowing:

- Only owners and admins can connect GitHub for a team.
- Your GitHub account needs to be linked to DeviceCloud first, under **Settings → Account**. This is separate from installing the App — it's how we know which DeviceCloud account an installation belongs to.
- If you're an admin on more than one team, you may be asked which one to connect if we can't figure it out automatically using account context.

## Choosing which repositories

Checks only post on repositories the App can access. **Settings → Integrations** shows the current scope — either *All repositories* or a count of selected ones — with a **Manage repositories on GitHub** link that opens the installation's settings, where you can add or remove repositories.

Changes take effect immediately; we track GitHub's repository events, so the console reflects the new scope without you reconnecting.

## Run your tests

Run the [Action](github-actions.md) on your pull requests with `async: true`. It attaches the repository and commit for you, which is how DeviceCloud knows where to post the check, so leave [`include-github-context`](github-actions.md#github-pr-context) on (it's on by default).

```yaml
on:
  pull_request:
    branches: [main]

jobs:
  mobile-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      # build your app, or download a prebuilt artifact from an earlier job
      - uses: devicecloud-dev/device-cloud-for-maestro@v2
        with:
          api-key: ${{ secrets.DCD_API_KEY }}
          app-file: app/build/outputs/apk/release/app-release.apk
          async: true
```

## More than one run per PR

If a pull request kicks off more than one run — an iOS one and an Android one, say — each run posts its own check, but by default they're both called **DeviceCloud** and nothing on the PR tells them apart. Give each run a `check-name` and they get their own:

```yaml
jobs:
  ios:
    runs-on: ubuntu-latest
    steps:
      - uses: devicecloud-dev/device-cloud-for-maestro@v2
        with:
          api-key: ${{ secrets.DCD_API_KEY }}
          app-file: build/MyApp.app.zip
          async: true
          check-name: iOS          # DeviceCloud / iOS

  android:
    runs-on: ubuntu-latest
    steps:
      - uses: devicecloud-dev/device-cloud-for-maestro@v2
        with:
          api-key: ${{ secrets.DCD_API_KEY }}
          app-file: build/app.apk
          async: true
          check-name: Android      # DeviceCloud / Android
```

This matters for more than tidiness. GitHub identifies a required check by its name, so two runs sharing one name share one entry in branch protection — and that entry follows whichever run finished last, meaning a passing Android run can satisfy a gate the failing iOS run should have held. Separate names give you two checks you can require independently.

Use a value that stays the same on every run of that job. A name built from the commit or the run number is a different check every time, so it can never be required — and it'll clutter the PR.

The same setting exists on our other CI integrations: `check_name` on the [Bitrise step](bitrise-steps.md), `CHECK_NAME` on the [Bitbucket pipe](bitbucket-pipelines.md), and `DCD_CHECK_NAME` on [EAS Workflows](eas-workflows.md). From the CLI directly, pass it as metadata: `dcd cloud --metadata gh_check_name=iOS ...`.

## Require it before merging

To make the check a merge gate, add it to a branch protection rule: your repo's **Settings → Branches → Require status checks to pass**, then pick **DeviceCloud** (or each of your named checks, if you set `check-name`). GitHub only lists a check here after it's run at least once, so open a pull request before you set up the rule.

## Re-running failures

A failed check has a **Re-run failed tests** button. It re-runs only the flows that failed (not cancelled ones) and is free, like retries from the CI. GitHub's own **Re-run** on the check does the same. Either one moves the check back to in-progress until the re-run finishes.

## What the check shows

The pass count as the title (for example `9/10 passed`), then the run's name, the pass/fail count and total runtime. Below that, a table of flows with a result icon for each (up to 50 rows), the failure reasons for up to 10 failed flows (each cut to 200 characters), and one link to the whole run in the console, where you'll find the logs, videos and screenshots.

## Managing the connection

**Settings → Integrations** shows the connected account and the repositories the App can reach. Owners and admins can disconnect from there, which always removes the connection and stops the checks. We also try to uninstall the App from GitHub as part of that — if we can't, the console says so and links you to remove it yourself. You can uninstall from your GitHub settings at any time regardless.

Because disconnecting uninstalls the App, connecting again later takes you through the install step again. If the uninstall didn't go through and the App is still installed, we reconnect to that installation instead.

## When a check doesn't show up

Usually it's one of these:

- **Nothing posts on the PR.** The App isn't installed on that repo, isn't connected to your team, the run used a different team's API key, or the run didn't carry `gh_repo` and `gh_sha` metadata. Check **Settings → Integrations**, and confirm the repo is in scope under **Manage repositories on GitHub**.
- **The check is on a commit the PR doesn't show.** `gh_sha` must be the PR's head commit. In a GitHub Actions `pull_request` run, `GITHUB_SHA` is a temporary merge commit, so pass `${{ github.event.pull_request.head.sha }}` instead. The Action does this for you.
- **Connecting fails for a GitHub account that another team uses.** An installation can be connected to one team at a time. Disconnect it from the other team first, then connect again.
- **Connect GitHub lands on a GitHub 404.** That's a configuration problem on our side, not yours — nothing you can change will fix it. Get in touch and we'll sort it.
- **The check is stuck in progress.** The run probably hasn't finished yet. Look it up in the console; the check only resolves once every flow reaches a final state.
- **"That GitHub account isn't linked."** Link your GitHub identity under **Settings → Account**, then connect.
- **The check isn't in the branch-protection list.** It has to run once on the repo before GitHub will offer it. Open a pull request first.

---

See also [GitHub Actions](github-actions.md) and [Async Execution](../advanced/async-execution.md).
