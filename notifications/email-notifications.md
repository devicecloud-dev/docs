# Email Notifications

DeviceCloud can email a pass/fail summary of each test run to your team, so people find out about failures without having to open the console.

Unlike [Slack](slack-notifications.md) and [webhook](webhook-notifications.md) notifications, email is configured **per project** in your `config.yaml` rather than from the console. That means it travels with your repo and can differ per branch or pipeline.

### Enabling email notifications

Add a `notifications.email` block to your `config.yaml` and list the recipients:

```yaml
# config.yaml
notifications:
  email:
    enabled: true
    recipients:
      - sam@example.com
      - devs@example.com
```

With this configuration you'll only be emailed when a run has at least one failed or cancelled flow. Passing runs are skipped to cut down on noise.

{% hint style="info" %}
The `config.yaml` is picked up automatically from the directory you pass to `dcd cloud`. See [Workspace Configuration](../configuration/workspace-config.md) for where the file lives and how it's loaded.
{% endhint %}

#### Also notify on passing runs

To receive a summary after **every** completed run — passes included — set `onSuccess` to `true`:

```yaml
# config.yaml
notifications:
  email:
    enabled: true
    onSuccess: true
    recipients:
      - sam@example.com
      - devs@example.com
```

### What's in the email

The email is sent from **DeviceCloud &lt;hello@devicecloud.dev&gt;** and includes:

- A **subject line** that summarises the outcome at a glance — e.g. *"2 failed for test run Smoke Suite"*, *"All 12 tests passed for test run Smoke Suite"*, or *"All 3 tests cancelled for test run Smoke Suite"*.
- The **test suite (upload) name** and an overall count of **total / passed / failed / cancelled** flows.
- A list of every flow **grouped by status**, with each flow name linking straight to its result in the console. Retried flows are tagged with a **RETRY** badge.
- A **View Full Results** button linking to the complete run in the console.

### Disabling

Set `enabled: false` (or remove the `notifications.email` block) and commit the change to stop email notifications. Because the setting lives in `config.yaml`, it takes effect on the next run that uses that config.
