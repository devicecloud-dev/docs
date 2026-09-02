# Maestro Versions

Device Cloud supports multiple Maestro versions to ensure compatibility with your test flows.

By default, tests currently run using Maestro 2.2.0.

Please note that we periodically remove support for older versions so we always recommend you stay up to date.

## Available Versions

We currently support the following versions of Maestro:

* 2.0.4
* 2.0.9
* 2.1.0
* 2.2.0
* 2.5.0
* 2.5.1
* 2.6.0
* 2.6.1
* 2.7.0
* 2.8.0

## Version Selection

You can specify a version using `--maestro-version <version>`.

We additionally support the use of `--maestro-version latest` which will default to the most up-to-date version we support. This currently resolves to 2.8.0.

Note that Maestro 2.7.0 reorganised the per-flow debug output into a new bundle layout, with screenshots named `step-<number>-<command>.png`. If you download and process test artifacts programmatically, check your tooling against a 2.7.0 or later run before switching.

### Examples

```bash
# Use a specific version of Maestro
dcd cloud ... --maestro-version 2.1.0

# Always use the most recent version of Maestro available
dcd cloud ... --maestro-version latest
```

## Maestro Support Policy

We will always aim to support the following versions of Maestro:

- The latest version plus the previous three.

We additionally will aim to continue supporting previous versions up to a maximum of ten. 

The default version will always be at maximum, four minor releases behind the latest. For example if the latest is 2.9.0, then the default is 2.5.0. We will always provide at least 30 days of notice before changing the default version.

We will also always aim to provide at least 30 days of warning before removing support for previous Maestro versions.