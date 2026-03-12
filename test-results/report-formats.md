# Report Formats

Device Cloud supports standard Maestro report formats as well as Allure, a DeviceCloud-specific format that provides enhanced visualisation and history tracking.

## Maestro Formats

### JUnit Format

```bash
dcd cloud ... --report junit
```

### HTML Format

```bash
dcd cloud ... --report html
```

### HTML Detailed Format

```bash
dcd cloud ... --report html-detailed
```

## DeviceCloud Formats

### Allure Format

Allure is not a standard Maestro format — it is provided by DeviceCloud and offers richer reporting with trend history, categories, and timeline views.

```bash
dcd cloud ... --report allure
```
