# Cypress E2E Tests

To get started locally:

- Generate a vercel token using [this guide](https://vercel.com/support/articles/how-do-i-use-a-vercel-api-access-token)
- In your `.env`, add your Vercel token to the key `CI_VERCEL_TOKEN`
- run `yarn cy:dev`

This will spin up the full stack and open the cypress development GUI. Click the integration test
you're working on from the list and cypress will open a runner, which will
execute the test file, and re-execute it each time the file is saved again.

Cypress will watch all files in the cypress folder and restart anytime one
is modified.

If you want to run the tests headlessly as a one-off run `yarn cy:run`.
However, expect to see some environmental errors since this mode is tuned
for CI contexts.

Cypress is laid out as follows:

- test sequences are located in [integration](./integration)
- environment set up and plugins are in [plugins](./plugins)
- custom commands exist in [support](./support)
- [fixtures](./fixtures) is meant to hold data stubs

If you want to get started writing cypress tests, check out our existing
test sequences and check out their [docs] and [api].

[docs]: https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#What-you-ll-learn
[api]: https://docs.cypress.io/api/table-of-contents

## Troubleshooting

- `./scripts/ci.sh: line 48: 86189 Terminated: 15 "${VERCEL_CMD[@]}" 2>&1`
  Try deleting your existing Docker containers and run the command again. You should be able to spin up your dev Docker environment afterwards normally by running `yarn docker:start`
