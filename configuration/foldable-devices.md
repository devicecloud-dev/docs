# Foldable Devices

DeviceCloud runs two foldables: the **iPhone Duo** on iOS 27 and the **Pixel 10 Pro Fold** on API levels 36 and 37. Each starts a run in one posture, and a flow can fold or unfold it part-way through, then tap, swipe and take screenshots on whichever screen is active. Foldable runs are charged at the advanced rate, see [pricing](../billing/test-run-billing.md).

| Device            | Flags                                                      | Starts                         | Postures                  | Screens                                         |
| ----------------- | ---------------------------------------------------------- | ------------------------------ | ------------------------- | ----------------------------------------------- |
| iPhone Duo        | `--ios-device iphone-duo --ios-version 27`                 | `closed`, on the cover screen  | `closed`, `book`, `open`  | cover 1398 x 2034, plus the larger inner screen |
| Pixel 10 Pro Fold | `--android-device pixel-10-pro-fold --android-api-level 36` | `open`, on the inner screen    | `closed`, `half`, `open`  | inner 2076 x 2152, cover 1080 x 2364            |

A single flow can also name a foldable with [per-flow devices](per-flow-devices.md), for example `DEVICECLOUD_OVERRIDE_IOS_DEVICE: iphone-duo` with `DEVICECLOUD_OVERRIDE_IOS_VERSION: "27"`.

## Device control from a flow

Maestro has no fold command, so DeviceCloud gives every foldable run a small HTTP control server on the device's host. Its address reaches your flow as the `DCD_CONTROL_URL` environment variable, and a flow calls it from a `runScript` step with Maestro's built-in `http` client.

Save this script as `dcd.js` next to your flows:

```javascript
// dcd.js: sends one device-control command to DeviceCloud.
// CMD is the command (state, posture, tap, longPress, swipe or screenshot)
// and ARGS its JSON body. A refused command fails the step with the
// server's message; the response is left in output.dcd.
var route = CMD;
var response = route === 'state'
  ? http.get(DCD_CONTROL_URL + '/' + route)
  : http.post(DCD_CONTROL_URL + '/' + route, {
      headers: { 'Content-Type': 'application/json' },
      body: typeof ARGS === 'string' && ARGS ? ARGS : '{}',
    });
if (!response.ok) {
  throw new Error('dcd ' + route + ' failed: HTTP ' + response.status + ' ' + response.body);
}
output.dcd = json(response.body);
```

Then call it from a flow:

```yaml
appId: my.app
---
- launchApp
- assertVisible: "Welcome"
# Unfold, then check the layout on the inner screen
- runScript: { file: dcd.js, env: { CMD: posture, ARGS: '{"posture":"open"}' } }
- assertVisible: "Welcome"
- runScript: { file: dcd.js, env: { CMD: screenshot, ARGS: '{"name":"home-unfolded"}' } }
# Fold it again
- runScript: { file: dcd.js, env: { CMD: posture, ARGS: '{"posture":"closed"}' } }
- assertVisible: "Welcome"
```

Each response is left in `output.dcd`, so a flow can assert on it, for example `assertTrue: ${output.dcd.posture == 'open'}`.

## Commands

| Command      | Body                                                     | Returns                                                                                                                                                                                                                              |
| ------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `state`      | none                                                     | `platform`, `device`, `posture` (the last one you set, or `null`), `postures` (the names this device accepts), `activeDisplay`, `screen` (`width`, `height` and `orientation` of the active screen) and `segments` (video parts so far) |
| `posture`    | `{"posture": "open"}`                                    | `posture`, `display` (the screen now active) and `ms` (how long the change took)                                                                                                                                                      |
| `tap`        | `{"x": 30, "y": 40}`                                     | nothing                                                                                                                                                                                                                              |
| `longPress`  | `{"x": 30, "y": 40, "ms": 1000}`                         | nothing; `ms` defaults to 1000 and is at most 10000                                                                                                                                                                                  |
| `swipe`      | `{"x1": 700, "y1": 300, "x2": 250, "y2": 300, "ms": 300}` | nothing; `ms` defaults to 300 and is at most 10000                                                                                                                                                                                   |
| `screenshot` | `{"name": "home-unfolded"}`                              | `file`, `width` and `height`                                                                                                                                                                                                         |

`state` is a GET and the others are POSTs with a JSON body; `dcd.js` takes care of that.

## Postures

**iPhone Duo:** `closed` (hinge shut, app on the cover screen), `book` (hinge at 127°, app on the inner screen) and `open` (flat, app on the inner screen). A posture change takes a few seconds, and the app is resized rather than relaunched. The `display` in the response is `LCD` for the cover screen and `LCD-1` for the inner screen.

Maestro's assertions keep working on the inner screen, but Maestro's own taps and swipes land on the cover screen. While the Duo is in `book` or `open`, use the `tap`, `longPress` and `swipe` commands for input, or fold back to `closed` and let Maestro carry on.

**Pixel 10 Pro Fold:** `closed` (app on the cover screen), `half` (half open, app on the inner screen) and `open` (flat, app on the inner screen). A posture change takes about a second. The `display` in the response is `cover` or `inner`. Maestro follows the active screen in every posture, so its own commands keep working after a fold. Folding locks the device, as it would a real phone, and DeviceCloud unlocks it again before the command returns.

## Coordinates

`tap`, `longPress` and `swipe` take coordinates on the screen the app is currently on: interface points on iOS and pixels on Android, from the top-left corner of the whole screen, status bar included. Take a `screenshot` in that posture, or read `screen` from `state`, to find them. A point outside the active screen is refused.

A control tap is not a Maestro command, so nothing waits for your app to be ready before it. Put an `assertVisible` on the element you are about to tap first.

Write the coordinates into `ARGS` as literals. Maestro evaluates a `${...}` expression in an `env:` value up to the last `}` of that value, so an expression inside the JSON body takes the body's closing brace with it and the step fails. For coordinates worked out at run time, build the body in a script of your own with `JSON.stringify` and post it to `DCD_CONTROL_URL + '/tap'`, the way `dcd.js` does.

## Screenshots and video

A `screenshot` captures the active screen and appears on the result page with the flow's other screenshots, named after the flow and the name you gave, `<flow>-dcd-<name>`. A name is 1 to 40 letters, digits, `-` or `_`, starting with a letter or digit.

The video follows your app. Each posture change that moves it to the other screen starts a new part of the recording on that screen, and the parts are joined, with a short freeze at the fold, into the single video on the result page.

## Using the commands on other devices

Any iPhone, iPad or Android run can have the control server too. Set `DEVICECLOUD_OVERRIDE_DEVICE_CONTROL` in the flow's `env:` block:

```yaml
appId: my.app
env:
    DEVICECLOUD_OVERRIDE_DEVICE_CONTROL: "true"
---
- launchApp
- assertVisible: "Welcome"
- runScript: { file: dcd.js, env: { CMD: tap, ARGS: '{"x":30,"y":92}' } }
```

`tap`, `longPress`, `swipe` and `screenshot` work as above, in points on iOS and pixels on Android, `state` reports an empty `postures` list, and `posture` is refused because the device doesn't fold. Like all `DEVICECLOUD_OVERRIDE_*` settings, this only works in the flow's `env:` block, not with `-e`.

## Errors and limits

* A refused command fails the step with the HTTP status and the server's message, for example `dcd posture failed: HTTP 400 {"ok":false,"error":"posture must be one of closed, book, open, got \"flat\""}`. A bad body or name is `400`, an unknown command `404`, a point off the screen or a posture on a device that doesn't fold `422`, and a device that didn't respond `500`.
* Commands run one at a time. A second call while one is still running is refused with `409`.
* Each command has 25 seconds to complete, well inside the flow's own time limit.
* The server exists only for the flow's run, on the device's host, and is reachable only through the per-run `DCD_CONTROL_URL`.
