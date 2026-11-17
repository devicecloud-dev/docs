# Chrome Onboarding

Chrome Onboarding pre-configures Chrome browser settings before your tests run on Android devices, ensuring that first-run dialogs don't interfere with test execution.

## Onboarding Methods

By default we use a config-based Chrome onboarding which adds minimal overhead and works for most scenarios.

If config-based onboarding can't be confirmed on the device, we automatically switch to Maestro-based onboarding, which runs a Maestro flow that opens Chrome and taps through its first-run screens. It's more thorough, but it adds significant overhead, because the flow runs on the device before your test.

If Maestro-based onboarding fails, the test goes back in the queue to start again on a fresh device. This doesn't use up a [retry](retry-strategies.md) and isn't charged. If onboarding still fails on the last attempt, the test starts anyway, and the test's log notes that Chrome may show its welcome screen first.

## Forcing Maestro-based Onboarding

If you're experiencing issues with Chrome, you can force Maestro-based onboarding using the CLI flag `--maestro-chrome-onboarding`.

::: warning
Maestro-based onboarding **will slow your test suite down**. We only recommend it if you're having issues with the default config-based method.
:::
