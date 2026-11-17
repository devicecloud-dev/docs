# Any CI

The DeviceCloud CLI runs anywhere Node 22 or later is installed, so you can call it from any CI service in a single script step.

We recommend using npx so you don't need to install the npm package. In CI, authenticate with an [API key](../getting-started/api-keys.md) — set `DEVICE_CLOUD_API_KEY` as a secret, or pass `--api-key`. For example:

```bash
npx --yes @devicecloud.dev/dcd@latest cloud --app-file build/app-release.apk --flows .maestro --quiet
```

The CLI reads `DEVICE_CLOUD_API_KEY` from the environment, so you don't need `--api-key` when the secret is exposed under that name. `--quiet` leaves out the progress updates while the run is polled, which keeps CI logs short.

## Pass or fail

`dcd cloud` waits for the run to finish and sets its exit code from the result, so the CI step fails when your tests do:

| Exit code | Meaning |
|---|---|
| `0` | Every flow passed, or a newer run superseded this one through [`--cancel-previous`](../advanced/cancel-previous.md). |
| `2` | The run failed: a flow failed or was cancelled. |
| `1` | A CLI or infrastructure error, for example a wrong path, a network failure or a run the API refused to start. |

Two flags change this. With `--async`, the CLI exits `0` as soon as the run is submitted, whatever the result. With `--json-file`, it exits `0` even when the run fails, so don't use it on a step that should gate your pipeline. See [Exit Codes](../advanced/exit-codes.md).

## GitLab CI

Add `DEVICE_CLOUD_API_KEY` as a masked variable under **Settings > CI/CD > Variables**. A variable marked **Protected** only reaches pipelines on protected branches and tags.

```yaml
# .gitlab-ci.yml
e2e:
  stage: test
  image: node:lts
  needs: [build] # your job that builds the APK and keeps it as an artifact
  script:
    - npx --yes @devicecloud.dev/dcd@latest cloud --app-file build/app-release.apk --flows .maestro --name "$CI_COMMIT_SHORT_SHA" --quiet
```

## CircleCI

Add `DEVICE_CLOUD_API_KEY` under **Project Settings > Environment Variables**, or in a context.

```yaml
# .circleci/config.yml
version: 2.1

jobs:
  e2e:
    docker:
      - image: cimg/node:lts
    steps:
      - checkout
      - attach_workspace: # the APK that an earlier job saved with persist_to_workspace
          at: .
      - run: npx --yes @devicecloud.dev/dcd@latest cloud --app-file build/app-release.apk --flows .maestro --name "$CIRCLE_SHA1" --quiet

workflows:
  test:
    jobs:
      - build # your job that builds the APK
      - e2e:
          requires: [build]
```

## GitHub checks

If your code is on GitHub and the [DeviceCloud GitHub App](github-checks.md) is connected, pass the repository and the commit, and DeviceCloud posts a check on that commit:

```bash
npx --yes @devicecloud.dev/dcd@latest cloud --app-file build/app-release.apk --flows .maestro \
  --repo-name acme/my-app --commit-sha "$COMMIT_SHA"
```

Use the commit that your pull request shows. On CircleCI that's `$CIRCLE_SHA1`, with `--repo-name "$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME"`. In a GitHub Actions `pull_request` run it's `${{ github.event.pull_request.head.sha }}`, not `GITHUB_SHA`: that one is a temporary merge commit, and a check posted on it never shows on the PR.

When a commit is tested more than once, add `--metadata gh_check_name=iOS` (a different name per job) so each run posts its own check (`DeviceCloud / iOS`) that branch protection can require on its own.

## Need help?

Ask in [Discord](https://discord.gg/gm3mJwcNw8). To request an integration for your CI provider, post in [GitHub Discussions](https://github.com/orgs/devicecloud-dev/discussions).
