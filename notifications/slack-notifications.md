# Slack Notifications

DeviceCloud can post a pass/fail summary to a Slack channel every time a test run completes, so your team finds out about failures without checking the console.

Slack is configured once per organization from the DeviceCloud console — there is nothing to add to your `config.yaml` or CI pipeline.

### Connecting Slack

1. Head to the [console settings](https://console.devicecloud.dev/settings?section=notifications) page and open the **Notifications** section.
2. Click **Connect Slack**. You'll be redirected to Slack to authorize DeviceCloud for your workspace.
3. After you approve, you'll be returned to the console.
4. Pick the **channel** you want notifications posted to and click **Save**.

{% hint style="info" %}
DeviceCloud requests only the permissions it needs to list your channels and post messages. It cannot read your messages.
{% endhint %}

#### Sending a test message

Once a channel is selected, use **Send test** to post a sample message to that channel and confirm everything is wired up. The test uses data from your most recent run when available.

#### Only notify on failures

By default DeviceCloud posts after **every** completed run. To cut down on noise, turn on **Only notify on failures** in the Slack section — passing runs will then be skipped and you'll only get a message when a run has at least one failed or cancelled flow.

#### Post again after retries

If you retry tests after a run has already been posted, DeviceCloud doesn't post again by default. Turn on **Post again after retries** to get an updated message once the retried tests finish; its duration covers only the retry.

### What's in the message

Each notification includes:

- An overall **passed / failed** status (a run with any failed or cancelled flow counts as failed).
- The test suite (upload) name, pass/fail counts, and duration.
- **Run environment**: app ID, device & OS (e.g. *Android · Pixel 7 · API 34*), Maestro version, and runner type.
- A list of failed flows with their failure reason, where available. The list shows up to 10 flows (with a count of any more), and each reason is shortened to 140 characters.
- A **View results in DeviceCloud** link to the run in the console.

#### Choosing what's shown

Under **What to show** you can turn each optional part of the message on or off: App ID, Device and OS, Maestro version, Runner type, Git / PR context, the per-flow failures list, and the retry count (shown when it's above zero). All of them are on by default; the suite name, pass/fail counts and duration are always shown.

**Duration shown** picks which duration appears: **Overall runtime** (the default — wall-clock time from the first test starting to the last one finishing), **Suite runtime (summed)** (every test's duration added together, which is large for parallel runs), or **Both**.

#### Git / CI context

When a run carries git metadata, the message also shows a line with the **repository**, **branch**, a linked **commit**, and a linked **pull request**.

This is filled in automatically when you use the [GitHub Action](../ci-cd/github-actions.md), and by the [EAS integration](../ci-cd/eas-workflows.md#git-context-optional) when you set its `DCD_GH_*` variables. Elsewhere, pass the git flags to the CLI — or, in other CI integrations, the matching `gh_*` metadata keys (`gh_repo`, `gh_branch`, `gh_sha`, `gh_pr_number`, `gh_pr_url`):

```bash
dcd cloud app.apk flows/ \
  --branch "$GIT_BRANCH" \
  --commit-sha "$GIT_SHA" \
  --repo-name "owner/repo" \
  --pr-number "123" \
  --pr-url "https://github.com/owner/repo/pull/123"
```

The line only appears when at least one of these values is present, and the commit/PR become clickable GitHub links when a `--repo-name` is supplied.

### Disconnecting

Click **Disconnect** in the Slack section to stop notifications and revoke DeviceCloud's access to your workspace. You can disconnect and reconnect at any time.
