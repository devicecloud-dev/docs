# Devices & OS Versions

### Default Devices

If you don't specify a device or OS version, then you will be allocated the default device image:

**Android:** Pixel 7 (API level 34)

**iOS:** iPhone 14 (iOS 17.4)

### Android API Levels

DeviceCloud will default to API level 34 unless you pass the `--android-api-level` flag:

```bash
dcd cloud app.apk test.yaml --android-api-level 35
```

| Android Version | API Level |
| --------------- | --------- |
| Android 16      | 36        |
| Android 15      | 35        |
| Android 14      | 34        |
| Android 13      | 33        |
| Android 12L     | 32        |
| Android 12      | 31        |
| Android 11      | 30        |
| Android 10      | 29        |

Need Google Play? See [google-play-apis.md](../configuration/google-play-apis.md)

### Android Devices

DeviceCloud will default to Pixel 7 unless you pass the `--android-device` flag:

```bash
dcd cloud app.apk test.yaml --android-device pixel-6
```

| id            | Name        | Dimensions  | Valid Android API Levels       |
| ------------- | ----------- | ----------- | ------------------------------ |
| `pixel-6`     | Pixel 6     | 1080 x 2400 | 29, 30, 31, 32, 33, 34, 35, 36 |
| `pixel-6-pro` | Pixel 6 Pro | 1440 x 3120 | 33, 35                         |
| `pixel-7`     | Pixel 7     | 1080 x 2340 | 33, 34, 35, 36                 |
| `pixel-7-pro` | Pixel 7 Pro | 1440 x 3120 | 33, 34, 35, 36                 |

### iOS Versions

DeviceCloud will default to iOS 17 unless you pass the `--ios-version` flag:

```bash
dcd cloud app.zip test.yaml --ios-version 18
```

| id   | Version |
| ---- | ------- |
| `26` | 26.4    |
| `18` | 18.6    |
| `17` | 17.5    |
| `16` | 16.4    |

### iOS Devices

DeviceCloud will default to iPhone 14 unless you pass the `--ios-device` flag:

```bash
dcd cloud app.zip test.yaml --ios-device ipad-pro-6th-gen
```

| id                  | Name                      | Dimensions  | Valid iOS versions |
| ------------------- | ------------------------- | ----------- | ------------------ |
| `iphone-16-pro-max` | iPhone 16 Pro Max         | 1290 x 2796 | 18, 26             |
| `iphone-16-pro`     | iPhone 16 Pro             | 1179 x 2556 | 18, 26             |
| `iphone-16`         | iPhone 16                 | 1170 x 2532 | 18, 26             |
| `iphone-15`         | iPhone 15                 | 1170 x 2532 | 17                 |
| `iphone-14`         | iPhone 14                 | 1170 x 2532 | 16, 17, 18         |
| `ipad-pro-6th-gen`  | iPad Pro (6th Generation) | 2732 x 2048 | 18, 26             |
