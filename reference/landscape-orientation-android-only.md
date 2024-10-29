# Landscape Orientation (android only)

Maestro doesn't officially support non-portrait orientations.

However, we've found that Android often works correctly with landscape orientation, provided the emulator is oriented before the Maestro test begins.

dcd supports this use case with the orientation flag:

```
dcd cloud --apiKey <yourKey> --orientation 90 app.apk test.yaml
```
