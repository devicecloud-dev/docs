# Any CI

As DeviceCloud uses a simple CLI, you can run it in any CI service using a basic script in bash (or any lang).

We recommend using npx so you don't need to install the npm package. For example:

```
npx --yes @devicecloud.dev/dcd@latest cloud sample.zip ios-flow.yaml --quiet --apiKey ${{ secrets.DEV_DCD_API_KEY }}
```

If you need advice - please ask in Discord, we'd be happy to provide pointers.

Want a specific CI integration build? Please request it in [GitHub Discussions](https://github.com/orgs/devicecloud-dev/discussions)
