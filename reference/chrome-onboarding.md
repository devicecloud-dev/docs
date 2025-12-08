# Chrome Onboarding

Chrome Onboarding pre-configures Chrome browser settings before your tests run on Android devices, ensuring that first-run dialogs don't interfere with test execution.

### Onboarding Methods

By default we use config-based Chrome onboarding which adds minimal overhead and works for most scenarios.

If config-based onboarding fails, we automatically switch to Maestro-based onboarding which uses a Maestro script. While more thorough, Maestro-based onboading adds significant overhead as it runs an additional flow on the device before your tests.

### Forcing Maestro-based Onboarding

If you're experiencing issues with Chrome, you can force Maestro-based onboarding using the CLI flag `--maestro-chrome-onboarding`.

**Important: U**sing Maestro-based onboarding **will slow your test suite down**. We therefore we only recommend using it if you are experiencing issues with the default config-based method.
