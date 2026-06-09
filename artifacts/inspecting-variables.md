# Inspecting Variables

When you view a test result, the Maestro log shows the commands your flow ran — including any variable references such as `${APP_ID}` or `${output.userId}`. DeviceCloud resolves those references for you and you can hover over a variable in the log to see the value it had during the run.

This works for variables from any source:

| Source | Example | Shown as |
| --- | --- | --- |
| Passed with `--env` | `${API_URL}` | `passed via --env` |
| Defined in the flow | `${APP_ID}` | `defined in flow` |
| Set by a script (static) | `${output.locators.loginButton}` | `script output` |
| Computed at runtime | `${output.sessionId}` | `runtime value` |

If a value genuinely can't be recovered (for example a value read from the screen at runtime that was never stored), the tooltip shows "Not captured".

## Hiding sensitive values

Some variables hold secrets — passwords, API tokens, auth credentials — that you don't want visible in the result log or in any downloaded artifact.

DeviceCloud masks these automatically, based on the variable's name. If a variable's name contains any of the following words (case-insensitive, anywhere in the name), its value is hidden and:

```
password   secret   token   apikey / api_key / api-key   auth
credential   passwd   pwd   pin   otp   private
```

You don't need any special syntax, just name the variable accordingly:

```bash
# Passed with --env
dcd cloud app.zip flow.yaml \
  -e DB_PASSWORD=... \
  -e API_TOKEN=... \
  -e SESSION_SECRET=...
```

```yaml
# Defined in a flow or set by a script
env:
  LOGIN_CREDENTIAL: ${CI_CREDENTIAL}
---
- evalScript: ${output.authToken = login()}
```

Matching is case-insensitive and matches anywhere in the name, so `apiToken`, `loginPassword`, `userPIN`, and `OTP_CODE` all qualify.

{% hint style="warning" %}
DeviceCloud accepts no liability for any secret that may be unintentionally displayed through this system. **If your secret has been leaked, rotate it immediately then contact our support team to flag the issue.**
{% endhint %}

### What masking covers

For a variable whose name matches, DeviceCloud:

- shows "Hidden — secret value" on hover instead of the value — the value is never sent to your browser;
- replaces the value with `***` in the result-page log;
- scrubs the value from downloadable artifacts (`maestro.log`, stdout/stderr, `commands.json`).

{% hint style="warning" %}
Masking is based on the variable **name**, not the value. A sensitive value stored under an innocent-looking name (e.g. `loginUrl = "https://example.com?key=abc123"`) will **not** be masked. Always name secret-bearing variables with one of the keywords above.
{% endhint %}
