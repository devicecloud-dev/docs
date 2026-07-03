# BitRise Steps

DeviceCloud includes a BitRise step to allow automatic triggering of tests via your BitRise CI process.



**How to configure the integration:**

1. Edit your workflow in BitRise to add a new step.
2. Search for 'Device Cloud for Maestro' and select the step.

<figure><img src="../.gitbook/assets/Screenshot 2025-01-06 at 14.45.27.png" alt=""><figcaption></figcaption></figure>

3. The step will now appear in your workflow

<figure><img src="../.gitbook/assets/Screenshot 2025-01-06 at 14.45.32.png" alt=""><figcaption></figcaption></figure>

4. Populate the API key using a BitRise secret and set any variables. The step inputs mirror the [`dcd cloud`](../cli/dcd-cloud.md) flags — see that reference for the full list and accepted values.

<figure><img src="../.gitbook/assets/Screenshot 2025-01-06 at 14.45.51.png" alt=""><figcaption></figcaption></figure>
