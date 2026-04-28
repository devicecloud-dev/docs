# Maestro Versions

Device Cloud supports multiple Maestro versions to ensure compatibility with your test flows.

By default, tests currently run using Maestro 2.2.0.

Please note that we periodically remove support for older versions so we always recommend you stay up to date.

## Available Versions

We currently support the following versions of Maestro:

* 1.39.1
* 1.39.5
* 1.41.0
* 2.0.4
* 2.0.9
* 2.1.0
* 2.2.0
* 2.4.0
* 2.5.0

{% hint style="danger" %}
Maestro 1.39.2, 1.39.7 and 2.0.3 are no longer supported. Runs using these versions will fail. Please upgrade to a newer version.
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
