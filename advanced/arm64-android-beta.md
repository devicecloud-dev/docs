# Arm64 Android (beta)

Most test execution services use Android emulators based on x86 architecture. However, most modern Android devices use Arm64 architecture.

There is a drive to move to Arm64 emulators to make them more realistic for end-to-end testing.

However, this change throws up some challenges:

* Arm hardware is currently more expensive to rent from the major cloud providers.
* Unavailability of Arm64 desktops/laptops.
* More complex build environments.
* Less off-the-shelf support from major CI providers such as GitHub Actions.

### Join the beta programme

We have successfully expanded our infrastructure to support Arm64, and we're currently in the process of onboarding teams who would like to try it.&#x20;

Email us or message us on Discord if you'd like to opt-in to the beta.

### Run a flow on Arm64

```
dcd cloud --apiKey <yourKey> --arm64 app.apk android-flow.yaml
```
