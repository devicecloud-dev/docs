# Device Configuration

### Default Devices

If you don't specify a device or OS version, then you will be allocated the default device image:

**Android:** Pixel 7 (API level 34)

**iOS:** iPhone 14 (iOS 17.2)

### Android API Levels

dcd will default to API level 34 unless you pass the `--android-api-level` flag:

```bash
dcd cloud --android-api-level 35 app.apk test.yaml
```

| Android Version | API Level |
| --------------- | --------- |
| Android 15      | 35        |
| Android 14      | 34        |
| Android 13      | 33        |
| Android 12L     | 32        |
| Android 12      | 31        |
| Android 11      | 30        |
| Android 10      | 29        |

Need Google Play? See [google-play-apis.md](../reference/google-play-apis.md)

### Android Devices

dcd will default to Pixel 7 unless you pass the `--android-device` flag:

```bash
dcd cloud --android-device pixel-7 app.apk test.yaml
```

| id               | Name                                                                                                                 | Dimensions  | Valid Android API Levels   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------- |
| `pixel-6`        | Pixel 6                                                                                                              | 1080 x 2400 | 29, 30, 31, 32, 33, 34, 35 |
| `pixel-6-pro`    | Pixel 6 Pro                                                                                                          | 1440 x 3120 | 33, 34, 35                 |
| `pixel-7`        | Pixel 7                                                                                                              | 1080 x 2340 | 33, 34, 35                 |
| `pixel-7-pro`    | Pixel 7 Pro                                                                                                          | 1440 x 3120 | 33, 34, 35                 |
| `generic-tablet` | Generic Tablet (Note: starts in landscape by default, use [orientation](../features/orientation.md)=90 for portrait) | 1440 x 2560 | 33, 34, 35                 |

### iOS Versions

dcd will default to iOS 17.2 unless you pass the `--ios-version` flag:

```bash
dcd cloud --ios-version 15 app.zip test.yaml
```

| id   | Version |
| ---- | ------- |
| `16` | 16.4    |
| `17` | 17.5    |
| `18` | 18.6    |

### iOS Devices

dcd will default to iPhone 14 unless you pass the `--ios-device` flag:

```bash
dcd cloud --ios-device ipad-pro-6th-gen app.zip test.yaml
```

<table><thead><tr><th>id</th><th>Name</th><th width="131">Dimensions</th><th>Valid iOS versions</th></tr></thead><tbody><tr><td><code>iphone-14</code></td><td>iPhone 14</td><td>1170 x 2532</td><td>16, 17, 18</td></tr><tr><td><code>iphone-14-pro</code></td><td>iPhone 14 Pro</td><td>1179 x 2556</td><td>16, 17, 18</td></tr><tr><td><code>iphone-15</code></td><td>iPhone 15</td><td>1170 x 2532</td><td>17, 18</td></tr><tr><td><code>iphone-15-pro</code></td><td>iPhone 15 Pro</td><td>1179 x 2556</td><td>17, 18</td></tr><tr><td><code>iphone-16</code></td><td>iPhone 16</td><td>1170 x 2532</td><td>18</td></tr><tr><td><code>iphone-16-plus</code></td><td>iPhone 16 Plus</td><td>1284 x 2778</td><td>18</td></tr><tr><td><code>iphone-16-pro</code></td><td>iPhone 16 Pro</td><td>1179 x 2556</td><td>18</td></tr><tr><td><code>iphone-16-pro-max</code></td><td>iPhone 16 Pro Max</td><td>1290 x 2796</td><td>18</td></tr><tr><td><code>ipad-pro-6th-gen</code></td><td>iPad Pro (6th Generation)</td><td>2732 x 2048</td><td>16, 17, 18</td></tr></tbody></table>

Feel free to request more devices via Discord.
