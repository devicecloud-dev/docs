# Maestro Versions

Device Cloud supports multiple Maestro versions to ensure compatibility with your test flows.

By default, tests currently run using Maestro 2.2.0. **From 19 October 2026 the default becomes Maestro 2.10.0.** Pin `--maestro-version` if you need to stay on a specific version.

Please note that we periodically remove support for older versions so we always recommend you stay up to date.

## Available Versions

We currently support the following versions of Maestro:

* 2.0.4 (deprecated - removed 19 October 2026)
* 2.0.9 (deprecated - removed 19 October 2026)
* 2.1.0 (deprecated - removed 19 October 2026)
* 2.2.0 (deprecated - removed 19 October 2026)
* 2.5.0 (deprecated - removed 19 October 2026)
* 2.5.1 (deprecated - removed 19 October 2026)
* 2.6.0 (deprecated - removed 19 October 2026)
* 2.6.1
* 2.7.0
* 2.8.0
* 2.9.0
* 2.10.0

{% hint style="warning" %}
Maestro 2.0.4, 2.0.9, 2.1.0, 2.2.0, 2.5.0, 2.5.1 and 2.6.0 are deprecated and will be removed on **19 October 2026**. Runs pinned to these versions will fail after that date - move to 2.6.1 or newer. On the same date the default version (used when `--maestro-version` is not passed) changes from 2.2.0 to 2.10.0.
{% endhint %}

## Version Selection

You can specify a version using `--maestro-version <version>`.

We additionally support the use of `--maestro-version latest` which will default to the most up-to-date version we support. This currently resolves to 2.10.0.

Note that Maestro 2.7.0 reorganised the per-flow debug output into a new bundle layout, with screenshots named `step-<number>-<command>.png`. If you download and process test artifacts programmatically, check your tooling against a 2.7.0 or later run before switching.

### Examples

```bash
# Use a specific version of Maestro
dcd cloud ... --maestro-version 2.1.0

# Always use the most recent version of Maestro available
dcd cloud ... --maestro-version latest
```
