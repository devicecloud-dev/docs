# Maestro Versions

Device Cloud supports multiple Maestro versions to ensure compatibility with your test flows.

By default, tests currently run using Maestro 2.2.0.

Please note that we periodically remove support for older versions so we always recommend you stay up to date.

## Available Versions

We currently support the following versions of Maestro:

* 1.39.5
* 1.41.0
* 2.0.4
* 2.0.9
* 2.1.0
* 2.2.0
* 2.5.0
* 2.5.1
* 2.6.0
* 2.6.1

{% hint style="warning" %}
Maestro 1.39.5 and 1.41.0 will be deprecated on 26th June 2026 and will no longer be available. We recommend upgrading to 2.6.0 or above.
{% endhint %}

## Version Selection

You can specify a version using `--maestro-version <version>`.

We additionally support the use of `--maestro-version latest` which will default to the most up-to-date version we support.

### Examples

```bash
# Use a specific version of Maestro
dcd cloud ... --maestro-version 2.1.0

# Always use the most recent version of Maestro available
dcd cloud ... --maestro-version latest
```
