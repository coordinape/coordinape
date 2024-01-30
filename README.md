Welcome to the code for [Coordinape](coordinape.com)! If you're new to the project, check out our [docs](https://docs.coordinape.com/).


[![GitPOAP Badge](https://public-api.gitpoap.io/v1/repo/coordinape/coordinape/badge)](https://www.gitpoap.io/gh/coordinape/coordinape)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=coordinape/coordinape&type=Timeline)](https://star-history.com/#coordinape/coordinape&Timeline)

# Contributing

Stack: **React**, [**Hasura**](#hasura), & **Vercel** serverless functions

- NodeJS v20
- pnpm
- Docker
- [Vercel CLI](https://vercel.com/cli)

# PNPM

We use [pnpm](https://pnpm.io/) to manage our dependencies. It's a drop-in replacement for `npm` and `yarn` that's faster and more space-efficient. If you don't have it installed, you can install it with `npm i -g pnpm`.

# NodeJS

We recommend NVM to manage your NodeJS versions. If you don't have it installed, you can install it:https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script

Then, run the following commands to install NodeJS v20 and set it as your default:

```shell
nvm install 20
nvm alias default v20
```

## Quick Start

- `pnpm install`
- `pnpm setup`
  - init git submodules & hardhat dependencies
- `cp .env.example .env`
- Edit `.env`
  - Set `HARDHAT_OWNER_ADDRESS` and `LOCAL_SEED_ADDRESS` to your local dev wallet
  - Set `REACT_APP_ALCHEMY_ETH_MAINNET_API_KEY` to an Alchemy Ethereum Mainnet project API KEY, which you can get for free at [alchemy.com](https://www.alchemy.com/)
- `pnpm docker:start` - Start **Hasura** and **postgres**
  - Clear the data stored in the docker volumes: `pnpm docker:clean`
- `pnpm db-seed-fresh` - Seed the db w/ dummy data
- `pnpm start`
  - Runs React and the serverless functions in `api/`
- Go to http://localhost:3000 and start giving!

If you want to hack on end-to-end tests, or see why one might be failing,
see our [cypress README](./cypress/README.md).

## Useful zsh aliases:

```
# Co shortcuts

alias co='cd ~/code/coordinape/'

# hasura migrations
mg() {
  pnpm hasura migrate --database-name default $@
}

# apply hasura migrations
mga() {
  pnpm hasura migrate apply --database-name default $@
}

# show status of migrations
mgs() {
  pnpm hasura migrate status --database-name default $@
}

# restart hasura and reload metadata
alias mdr='pnpm hasura metadata apply && pnpm hasura metadata reload && pnpm hasura metadata ic list'


# inntall and start
alias start="pnpm i && pnpm start"
```

## Running tests

- Setup: Set `REACT_APP_ALCHEMY_ETH_MAINNET_API_KEY` in `.env` to the API-KEY of an RPC node with access to archive data. It's used to set up a mainnet fork for the test environment
  - Could use your Alchemy Ethereum Mainnet RPC API-KEY

For a one-off test run, run `pnpm test:ci`. This starts test instances of Hasura, Postgres, and the web app, populates them with test data, and runs both Jest and Cypress tests against them.

If you want to run tests interactively as you develop:

1. Run `pnpm test:up`. This will start the test instances.
2. In another terminal, run either `pnpm test` for the Jest tests, or `pnpm cy:dev` for the Cypress tests.
3. Just Ctrl-C the process in the first terminal when you're done.

# Frontend

More detailed guidelines coming soon.

When writing new frontend components, please use Stitches instead of Material-UI. See:

- [Intro video with the author of Stitches](https://www.youtube.com/watch?v=Gw28VgyKGkw)
- Theme file: [`stitches.config.ts`](https://github.com/coordinape/coordinape/blob/main/src/stitches.config.ts)
- [`src/ui`](https://github.com/coordinape/coordinape/tree/main/src/ui), where we have a set of basic components
  - This folder is for simple HTML tags wrapped with `styled`; components with logic and/or state should still go in `src/components`, or in a subfolder named for the main component they belong to.

## Key libraries

- [Create React App](https://github.com/facebook/create-react-app)
- [Stitches](https://stitches.dev/)
- [ethers](https://docs.ethers.io/)
- Luxon
- Sentry (error reporting)

# Hasura

[Hasura](https://hasura.io/) creates a
[GraphQL API](https://hasura.io/learn/graphql/hasura/data-modeling/2-try-user-queries/)
atop our postgres db. We use it to apply
[migrations](https://hasura.io/learn/graphql/hasura-advanced/migrations-metadata/2-migration-files/)
and
[manage metadata](https://hasura.io/learn/graphql/hasura-advanced/migrations-metadata/3-metadata/).
Perhaps the easiest way to get a feel is start the app and run `pnpm hasura console`.

## Working with the schema

- `pnpm hasura console` to modify and explore the database
- `pnpm generate` after schema changes to codegen [Zeus](https://github.com/graphql-editor/graphql-zeus) & [react-query](https://react-query.tanstack.com/) libs
  - Requires `pnpm start` to be running

### Updating migrations / metadata

If you pull in any new changes to the schema, your local Hasura instance might start complaining about metadata inconsistency.
In order to apply the new migrations / metadata to your local instance, run the following commands:

```shell
pnpm hasura migrate apply
pnpm hasura metadata apply
```

## Previewing changes

Any changes you make in `pnpm hasura console` will be automatically exported to your local `hasura` directory as migrations or metadata.

These will be applied to the production instance once the PR is merged. You can test them in preview apps by merging them to staging first.

# Hardhat

[Hardhat](https://hardhat.org/) is used with [typechain](https://github.com/dethcrypto/TypeChain) to generate TypeScript bindings for the smart contracts, which are in this repo as a git submodule at [`hardhat/contracts`](https://github.com/coordinape/coordinape/tree/main/hardhat/contracts).

- `./scripts/rebuild_hardhat.sh` - Rebuild the generated code after making changes to contract code

# Troubleshooting

If you have more questions, please [create an issue](https://github.com/coordinape/coordinape/issues/new/choose) or ask in our [Discord channel](https://discord.com/invite/gBPMAmQ48p) `#devs-all`.
