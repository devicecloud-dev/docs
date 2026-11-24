# Maestro Versions

You can choose which Maestro version runs your flows, from the versions listed below.

By default, tests run using Maestro 2.10.0. Pin `--maestro-version` if you need to stay on a specific version.

We periodically remove support for older versions, so we always recommend you stay up to date.

## Available Versions

We support these versions of Maestro:

* 2.6.1
* 2.7.0
* 2.8.0
* 2.9.0
* 2.10.0
* 2.11.0
* 2.12.0
* 2.12.1

Maestro 2.2.0 was removed on 24 November 2026, and runs pinned to it are rejected. Move them to 2.6.1 or newer (the default is 2.10.0).

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

How we add, deprecate and remove Maestro versions is set out in our [Support Policy](../getting-started/support-policy.md#maestro-versions). We give at least 30 days' notice before removing a version or changing the default. Upcoming removals are listed in [Deprecations & Removals](../getting-started/deprecations.md).
