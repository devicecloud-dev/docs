# Maestro Versions

You can choose which Maestro version runs your flows, from the versions listed below.

By default, tests run using Maestro 2.10.0. Pin `--maestro-version` if you need to stay on a specific version.

We periodically remove support for older versions, so we always recommend you stay up to date.

## Available Versions

We support these versions of Maestro:

* 2.2.0 (deprecated)
* 2.6.1
* 2.7.0
* 2.8.0
* 2.9.0
* 2.10.0
* 2.11.0
* 2.12.0
* 2.12.1

::: warning
Maestro 2.2.0 is deprecated and we're targeting removal on 23 November 2026. This date is subject to change based on usage. If you pin `--maestro-version` to 2.2.0, move it to 2.6.1 or newer (the default is 2.10.0). See the [Maestro Support Policy](maestro-versions.md#maestro-support-policy) for more information.
:::

Maestro 2.0.4, 2.0.9, 2.1.0, 2.5.0, 2.5.1 and 2.6.0 were removed on 19 October 2026. Runs pinned to these versions are rejected.

## Version Selection

You can specify a version using `--maestro-version <version>`.

You can also pass `--maestro-version latest`, which runs the newest version in the list above.

Note that Maestro 2.7.0 reorganised the per-flow debug output into a new bundle layout, with screenshots named `step-<number>-<command>.png`. If you download and process test artifacts programmatically, check your tooling against a 2.7.0 or later run before switching.

### Examples

```bash
# Use a specific version of Maestro
dcd cloud ... --maestro-version 2.10.0

# Always use the most recent version of Maestro available
dcd cloud ... --maestro-version latest
```

## Maestro Support Policy

We will always aim to support the latest versions of Maestro and additionally continue to provide support for previous versions. Our policy for this is as follows:

* We will always add support for new versions.
* Once a new minor version is released (for example 2.7.0), we'll mark every patch of the previous minor version (2.6.x) except the newest as deprecated.
* Once a minor version is five or more minor versions old, we may mark it as deprecated.
* Deprecated versions are then removed after 30 days, provided their total usage over seven days is less than 1%.

::: info
For example, Maestro 2.0.0 received 10 patch releases (2.0.1 to 2.0.10) and we supported all of them. Once Maestro 2.1.0 was released, we would deprecate 2.0.0 to 2.0.9 and keep 2.0.10.

Once Maestro 2.5.0 is released, 2.0.10 is five minor versions old, so we may mark it as deprecated and remove it after 30 days, provided its usage has dropped below 1%.
:::

We may update the default version from time to time and we will always provide at least 30 days of notice beforehand.

We will always provide at least 30 days of warning before removing support for previous Maestro versions. Upcoming removals are listed in [Deprecations & Removals](../getting-started/deprecations.md).
