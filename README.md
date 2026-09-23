# PostHog workflows as code: demo

This repository declares [PostHog workflows](https://posthog.com/docs/workflows) in TypeScript with `@posthog/workflows`.
A pull request checks every file, and a merge to `main` pushes it to PostHog.
A pushed workflow is code-managed, so PostHog shows it read-only and links back to its file here.

## Layout

- `workflows/*.ts`: one or more workflows per file. Each has a `key` that stays the same for its whole life.
- `vendor/posthog-workflows-0.0.0.tgz`: the SDK and the `posthog-workflows` CLI, packed from the PostHog repository because the package is not on npm yet.
- `.github/workflows/workflows.yml`: the CI job.

## Try it locally

```bash
npm ci
npx posthog-workflows check workflows/welcome.ts
```

`check` validates the file offline when no credentials are set.
With `POSTHOG_CLI_HOST`, `POSTHOG_CLI_PROJECT_ID` and `POSTHOG_CLI_API_KEY` set, it also prints what a push would change.

## Add a workflow

Write a new file with `npx posthog-workflows init workflows/<name>.ts`, or open a workflow in PostHog, use **Copy code**, and paste the result into `workflows/`.
Leave `status` out of the file: a new workflow starts as a draft, and a person turns it on in PostHog.

## CI

| Event | Job | Secrets |
| --- | --- | --- |
| Pull request | `posthog-workflows check` on each file | none |
| Push to `main` | joins the tailnet, then `posthog-workflows push` on each file | all below |

Repository secrets for the push job:

- `TS_OAUTH_CLIENT_ID`, `TS_OAUTH_SECRET`: a Tailscale OAuth client with the `auth_keys` scope that may assign `tag:posthog-workflows-demo-ci`.
- `POSTHOG_CLI_HOST`: the HTTPS URL of the PostHog instance. The CLI refuses plain `http` unless the host is loopback.
- `POSTHOG_CLI_PROJECT_ID`: the project to push to.
- `POSTHOG_CLI_API_KEY`: a project secret API key (`phs_...`) with the `hog_flow:write` scope.
