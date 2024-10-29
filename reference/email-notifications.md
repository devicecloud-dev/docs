# Email Notifications

DCD can be configured to notify you when a test run is complete.\
\
Simply make the changes to your `config.yaml`:\


#### To get notified on failures

```
# maestro_workspace/config.yaml
notifications:
  email:
    enabled: true
    recipients:
      - sam@example.com
      - devs@example.com
```

#### To get notified on successes and failures

```
# maestro_workspace/config.yaml
notifications:
  email:
    enabled: true
    onSuccess: true
    recipients:
      - sam@example.com
      - devs@example.com
```
