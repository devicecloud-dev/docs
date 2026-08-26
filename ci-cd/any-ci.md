# Any CI

As DeviceCloud uses a simple CLI, you can run it in any CI service using a basic script in bash (or any lang).

We recommend using npx so you don't need to install the npm package. In CI, authenticate with an [API key](../getting-started/api-keys.md) — set `DEVICE_CLOUD_API_KEY` as a secret, or pass `--api-key`. For example:

```bash
npx --yes @devicecloud.dev/dcd@latest cloud sample.zip ios-flow.yaml --quiet --api-key ${{ secrets.DEV_DCD_API_KEY }}
```

If your code is on GitHub, add `--metadata gh_repo=<owner/repo> --metadata gh_sha=<commit sha>` and DeviceCloud will post a [check](github-checks.md) on that commit. When a commit is tested more than once, add `--metadata gh_check_name=iOS` to each run so they post separately named checks (`DeviceCloud / iOS`) that branch protection can require independently.

If you need advice - please ask in [Discord](https://discord.gg/gm3mJwcNw8), we'd be happy to provide pointers.

Want a specific CI integration build? Please request it in [GitHub Discussions](https://github.com/orgs/devicecloud-dev/discussions)
