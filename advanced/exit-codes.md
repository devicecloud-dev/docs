# Exit Codes

The `dcd` CLI reports how a command went through its exit code, so a CI job can pass or fail on it.

## `dcd cloud`

| Code | Meaning |
|---|---|
| `0` | The run passed |
| `1` | The CLI couldn't finish: a bad flag or path, a network or API error, or a run the API refused to start |
| `2` | The run failed: at least one of its tests failed or was cancelled |

A run the API refuses to start exits `1`. That includes HTTP `402` refusals, when a run would take you over your [Overage Limit](../billing/overage.md#when-a-run-would-go-over-the-limit) or past a [usage alert's hard stop](../billing/usage-alerts.md#hard-stop), or a subscription payment is [overdue](../billing/test-run-billing.md#overdue-payments).

A run fails if any of its tests fails or is cancelled, so a run you cancel from the console also exits `2`. With `--async`, `dcd cloud` exits `0` as soon as the run is submitted, whatever the outcome.

A run superseded by a newer run through [`--cancel-previous`](cancel-previous.md) exits `0`, even if one of its tests had already failed. With `--json` or `--json-file`, its `status` is `SUPERSEDED`.

### JSON output

The two JSON flags behave differently around test failures:

- **`--json`** — prints results as JSON to stdout but still signals the outcome through the exit code: `0` on success, `2` on test failure, `1` on CLI/infrastructure errors.
- **`--json-file`** — writes results to a file and exits `0` even when the test run fails, so a failing test won't stop your pipeline. CLI/infrastructure errors still exit `1`.

::: info
Use `--json-file` when you want to inspect the result yourself rather than have a non-zero exit code fail the build. Use `--json` when you still want the exit code to gate your pipeline.
:::

On a CLI or infrastructure error, `--json` prints `{"status": "FAILED", "error": "…"}`. That's the same `status` as a failed run, so check the exit code, or look for an `error` field, to tell them apart. See [JSON output](../cli/dcd-cloud.md#json-output).

## `dcd status`

`dcd status` exits `0` whenever it can read the run, whatever the run's status, so check the status it prints rather than its exit code.

With `--json`, a failed lookup, such as an unknown upload ID or an API it can't reach, is reported as `FAILED` with an `error` field, and still exits `0`. Other errors, such as passing neither `--upload-id` nor `--name`, print the same `status` and `error` but exit `1`. See [dcd status](../cli/dcd-status.md#json-output).

## Other commands

`dcd upload`, `dcd list`, `dcd login` and the other commands exit `0` when they succeed and `1` when they fail. `dcd artifacts` exits `0` even when a download fails, unless you pass `--json`: then it exits `1` when every download failed.

## Device sessions

Every [`dcd device`](../cli/dcd-device.md) subcommand uses these codes:

| Code | Meaning |
|---|---|
| `0` | Done |
| `1` | Called wrongly: a bad flag or value, no session to pick, or credentials the API rejected |
| `2` | It ran and failed: a flow, action or launch failed, or the API couldn't do it |
| `3` | A limit was hit: concurrent sessions, spend cap or rate limit |
| `4` | The session has ended, or there is no such session |

The deprecated [`dcd live`](../cli/dcd-live.md) has no such contract. `dcd live run` exits `2` if the flow fails, or if it's still running when `--timeout` is reached. `dcd live exec` exits `0` even when the commands fail, so check the printed result.
