# Email Notifications

Configure email notifications in your `config.yaml`:

#### Notify on failures only

```yaml
# .maestro/config.yaml
notifications:
  email:
    enabled: true
    recipients:
      - sam@example.com
      - devs@example.com
```

#### Notify on successes and failures

```yaml
# .maestro/config.yaml
notifications:
  email:
    enabled: true
    onSuccess: true
    recipients:
      - sam@example.com
      - devs@example.com
```