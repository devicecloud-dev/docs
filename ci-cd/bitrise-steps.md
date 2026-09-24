# BitRise Steps

DeviceCloud includes a BitRise step to allow automatic triggering of tests via your BitRise CI process. This page describes version 1.4.0 of the step; where something is newer than 1.2.0, the version it arrived in is noted.



**How to configure the integration:**

1. Edit your workflow in BitRise to add a new step.
2. Search for 'Device Cloud for Maestro' and select the step.

<figure><img src="../.gitbook/assets/Screenshot 2025-01-06 at 14.45.27.png" alt=""><figcaption></figcaption></figure>

3. The step will now appear in your workflow

<figure><img src="../.gitbook/assets/Screenshot 2025-01-06 at 14.45.32.png" alt=""><figcaption></figcaption></figure>

4. Populate the API key using a BitRise secret and set any variables. Most inputs correspond to a [`dcd cloud`](../cli/dcd-cloud.md) flag — see that reference for accepted values. Not every flag has an input: device matrices, for example, aren't available in the step.

**Render Engine** (`render_engine`, from 1.3.0) picks the software renderer the Android emulator boots with on the default Android runner: `lavapipe` or `swiftshader`. Leave it empty to let DeviceCloud choose (`swiftshader` for apps built with Flutter, otherwise `lavapipe`).

### GitHub context

From 1.4.0, when your app's repository is on GitHub the step attaches the build's GitHub context to the run as metadata, read from Bitrise's environment: the repository (`gh_repo`), commit (`gh_sha`), branch (`gh_branch`) and, for pull request builds, the PR number and URL (`gh_pr_number`, `gh_pr_url`). That is what [GitHub checks](github-checks.md) need, so there's nothing to add. Keys you set yourself in the **Metadata** input take precedence, and **Include GitHub Context** (`include_github_context`) set to `false` turns this off.

On 1.2.0 and 1.3.0 the step doesn't attach these, so add `gh_repo` and `gh_sha` in the **Metadata** input (one `key=value` per line) or no check is posted:

```yaml
- device-cloud-for-maestro@1:
    inputs:
    - api_key: $DEVICE_CLOUD_API_KEY
    - app_file: $BITRISE_APK_PATH
    - workspace: .maestro
    - metadata: |-
        gh_repo=my-org/my-app
        gh_sha=$BITRISE_GIT_COMMIT
```

The **GitHub Check Name** input (`check_name`) names the check a run posts — `iOS` gives `DeviceCloud / iOS`. Set it when a commit is tested by more than one workflow, so each gets a check you can require separately in branch protection.

### Outputs

| Output | Description |
|--------|-------------|
| `DEVICE_CLOUD_CONSOLE_URL` | URL to view the run in the DeviceCloud console. |
| `DEVICE_CLOUD_UPLOAD_STATUS` | `PASSED` or `FAILED` once the run has finished, or `PENDING`, `QUEUED` or `RUNNING` if it hadn't (an async run reports whatever it had reached at submission). `ERROR` if the status couldn't be read. |
| `DEVICE_CLOUD_FLOW_RESULTS` | JSON array with one entry per flow: `name`, `status` and, for a failed flow, `failReason`. |
| `DEVICE_CLOUD_APP_BINARY_ID` | ID of the uploaded app binary, to reuse with `app_binary_id` in a later step. |

Before 1.4.0 the status, flow results and binary ID outputs are empty; only the console URL is set.

### Pass or fail

The step fails when the run fails. From 1.4.0 that also holds with **JSON File** (`json_file`) turned on, where the CLI itself exits `0`: the step decides from the run's status instead. On earlier versions, leave `json_file` off if the step's result gates your workflow.

<figure><img src="../.gitbook/assets/Screenshot 2025-01-06 at 14.45.51.png" alt=""><figcaption></figcaption></figure>
