# Slack Notifications

DeviceCloud can post a pass/fail summary to a Slack channel every time a test run completes, so your team finds out about failures without checking the console.

Slack is configured once per organization from the DeviceCloud console — there is nothing to add to your `config.yaml` or CI pipeline.

## Connecting Slack

1. Head to the [console settings](https://console.devicecloud.dev/settings?section=slack) page and open the **Slack** section.
2. Click **Connect Slack**. You'll be redirected to Slack to authorize DeviceCloud for your workspace.
3. After you approve, you'll be returned to the console.
4. Pick the **channel** you want notifications posted to and click **Save**.

{% hint style="info" %}
DeviceCloud requests only the permissions it needs to list your channels and post messages. It cannot read your messages.
{% endhint %}

## Only notify on failures

By default DeviceCloud posts after **every** completed run. To cut down on noise, turn on **Only notify on failures** in the Slack section — passing runs will then be skipped and you'll only get a message when a run has at least one failed flow.

## Sending a test message

Once a channel is selected, use **Send test** to post a sample message to that channel and confirm everything is wired up. The test uses data from your most recent run when available.

## What's in the message

Each notification includes:

- An overall **passed / failed** status.
- The test suite (upload) name.
- Pass/fail counts and total duration.
- A list of failed flows (with their failure reason, where available).
- A **View in DeviceCloud** button linking to the run in the console.

## Disconnecting

Click **Disconnect** in the Slack section to stop notifications and revoke DeviceCloud's access to your workspace. You can reconnect at any time.
