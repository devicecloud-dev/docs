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

We will always aim to support the latest versions of Maestro and additionally continue to provide support for previous versions. Our policy for this is as follows:

- We will always add support for new versions.
- Once a new minor version has been released (i.e. 2.x.0), we'll mark all previous patches of the previous minor (i.e. 2.6.x) bar the latest as deprecated.
- Once a minor version is five versions old, we'll mark it as deprecated.
- Once a version reaches below 1% usage, we'll mark it as deprecated.
- Deprecated versions are then removed after six weeks provided total usage is less than 0.5%.

% hint style="info" %
For example, Maestro 2.0.0 received 10 patch releases (2.0.1 -> 2.0.10) and we would provide support for all of them. Once Maestro 2.1.0 released, we would then remove support for 2.0.0 -> 2.0.9 and retain 2.0.10.

Once Maestro 2.5.0 is released, we would then mark 2.0.10 as deprecated unless usage dropped below 1% before then.
% endhint % 

We may change the default version from time to time and we will always provide at least 30 days of notice before changing the default version.

We will also always aim to provide at least 30 days of warning before removing support for previous Maestro versions.