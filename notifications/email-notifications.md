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

By default you'll only be emailed when a suite has at least one failed or cancelled flow.

{% hint style="info" %}
The `config.yaml` is picked up automatically from the directory you pass to `dcd cloud`. See [Workspace Configuration](../configuration/workspace-config.md) for where the file lives and how it's loaded.
{% endhint %}

#### Also notify on passing runs

To receive a summary after **every** completed run set `onSuccess` to `true`:

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

- An at-a-glance summary in the subject line.
- The test suite name and overall counts of passed, failed and cancelled flows.
- A grouped list of all flows by status.
- Links to view the suite or individual flows on the console.

{% hint style="info" %}
If you are not receiving emails for your test runs, try adding **hello@devicecloud.dev** to your safe senders list.
{% endhint %}

### Disabling

Simply set `enabled: false` (or remove the `notifications.email` block) from your `config.yaml`. 
