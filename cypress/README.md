# Cypress E2E Tests

To get started locally, run `yarn cy:dev`

If you want to run the tests headless and produce video and snapshot files,
run `yarn cy:run`.

Cypress is laid out as follows:

- test sequences are located in [integration](./integration)
- environment set up and plugins are in [plugins](./plugins)
- custom commands exist in [support](./support)
- [fixtures](./fixtures) is meant to hold data stubs

If you want to get started writing cypress tests, check out our existing
test sequences and check out their [docs] and [api].

[docs]: https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#What-you-ll-learn
[api]: https://docs.cypress.io/api/table-of-contents
