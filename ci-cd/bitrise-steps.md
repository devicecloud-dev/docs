# BitRise Steps

DeviceCloud includes a BitRise step to allow automatic triggering of tests via your BitRise CI process. This page describes version 1.2.0 of the step.



**How to configure the integration:**

1. Edit your workflow in BitRise to add a new step.
2. Search for 'Device Cloud for Maestro' and select the step.

<figure><img src="../.gitbook/assets/Screenshot 2025-01-06 at 14.45.27.png" alt=""><figcaption></figcaption></figure>

3. The step will now appear in your workflow

<figure><img src="../.gitbook/assets/Screenshot 2025-01-06 at 14.45.32.png" alt=""><figcaption></figcaption></figure>

4. Populate the API key using a BitRise secret and set any variables. Most inputs correspond to a [`dcd cloud`](../cli/dcd-cloud.md) flag — see that reference for accepted values. Not every flag has an input: device matrices and `--render-engine`, for example, aren't available in the step.

If your repository is on GitHub and you use [GitHub checks](github-checks.md), the step doesn't attach your commit details for you. Add `gh_repo` and `gh_sha` in the **Metadata** input (`metadata`, one `key=value` per line), otherwise no check is posted:

```yaml
- device-cloud-for-maestro@1:
    inputs:
    - api_key: $DEVICE_CLOUD_API_KEY
    - app_file: $BITRISE_APK_PATH
    - workspace: .maestro
    - metadata: |-
        gh_repo=my-org/my-app
        gh_sha=$BITRISE_GIT_COMMIT
    - check_name: Android
```

The **GitHub Check Name** input (`check_name`) names the check a run posts — `iOS` gives `DeviceCloud / iOS`. Set it when a commit is tested by more than one workflow, so each gets a check you can require separately in branch protection.

<figure><img src="../.gitbook/assets/Screenshot 2025-01-06 at 14.45.51.png" alt=""><figcaption></figcaption></figure>
