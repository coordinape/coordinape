Welcome to the code for [Coordinape](coordinape.com)! If you're new to the project, check out our [docs](https://docs.coordinape.com/).

[![GitPOAP Badge](https://public-api.gitpoap.io/v1/repo/coordinape/coordinape/badge)](https://www.gitpoap.io/gh/coordinape/coordinape)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/coordinape/coordinape) (experimental)

# Contributing

Stack: **React**, **Hasura** graphql server & **vercel** serverless functions

- NodeJS v14
- Yarn
- Docker
- [Vercel CLI](https://vercel.com/cli)

## Quick Start

- `yarn install`
- `yarn setup`
  - init git submodules & hardhat dependencies
- `cp .env.example .env`
  - Set `HARDHAT_OWNER_ADDRESS` and `LOCAL_SEED_ADDRESS` to your local dev wallet
- `yarn docker:start` - Start **Hasura** and **postgres**
  - Clear the data stored in the docker volumes: `yarn docker:clean`
- `yarn db-seed-fresh` - Seed the db w/ dummy data
- `yarn start`
  - Runs React and the serverless functions in `api/`
- Go to http://localhost:3000 and start giving!

If you want to hack on end-to-end tests, or see why one might be failing,
see our [cypress README].

[cypress readme]: ./cypress/README.md

# Frontend

More detailed guidelines coming soon.

When writing new frontend components, please use Stitches instead of Material-UI. See:

- [Intro video with the author of Stitches](https://www.youtube.com/watch?v=Gw28VgyKGkw)
- [`stitches.config.ts`](https://github.com/coordinape/coordinape/blob/main/src/stitches.config.ts)
- [`src/ui`](https://github.com/coordinape/coordinape/tree/main/src/ui), where we have a set of basic components
  - This folder is for simple HTML tags wrapped with `styled`; components with logic and/or state should still go in `src/components`, or in a subfolder named for the main component they belong to.

## Key libraries

- [Create React App](https://github.com/facebook/create-react-app)
- [Stitches](https://stitches.dev/)
- [ethers](https://docs.ethers.io/)
- Luxon
- Sentry (error reporting)
- d3-force-3d
  - See forked `canvas-color-tracker` for brave compatibility
- [Recoil](https://recoiljs.org/) - deprecated
- Material UI - deprecated

# Hasura

[Hasura](https://hasura.io/)
automagically creates a
[GraphQL API](https://hasura.io/learn/graphql/hasura/data-modeling/2-try-user-queries/)
atop our postgres db. We use it to apply
[migrations](https://hasura.io/learn/graphql/hasura-advanced/migrations-metadata/2-migration-files/)
and
[manage metadata](https://hasura.io/learn/graphql/hasura-advanced/migrations-metadata/3-metadata/).
Perhaps, the easiest way to get a feel is start the app and run `yarn hasura console`.

## Working with the schema

- `yarn hasura console` to modify and explore the database
- `yarn generate` after schema changes to codegen zeus & react-query libs
  - Requires `yarn start` to be running

### Updating migrations / metadata

If you pull in any new changes to the schema, your local Hasura instance might start complaining about metadata inconsistency.
In order to apply the new migrations / metadata to your local instance, run the following commands:

```shell
yarn hasura migrate apply
yarn hasura metadata apply
```

Alternately, you can just run `yarn docker:stop && yarn docker:start` and Hasura will apply the migrations/metadata automatically.

## Previewing changes

Any changes you make in `yarn hasura console` will be reflected in your local `hasura` directory as migrations or metadata. In the feature branch a clone of the staging database will be created with the changes.

These will be applied to the production instance once the PR is merged.

# Hardhat

[Hardhat](https://hardhat.org/) is used with [typechain](https://github.com/dethcrypto/TypeChain) to generate TypeScript bindings for the smart contracts, which are in this repo as a git submodule at [`hardhat/contracts`](https://github.com/coordinape/coordinape/tree/main/hardhat/contracts).

- Set `ETHEREUM_RPC_URL` in .env
  - From Infura project id: [Infura](https://infura.io) & create new project
  - Needs to have access to archive data
- `./scripts/rebuild_hardhat.sh` - Rebuild the generated code
- `yarn test` - Run tests
  - make sure `HARDHAT_FORK_BLOCK` is set (13500000 is a good value) and `ETHEREUM_RPC_URL` points to an archive node

# Gitpod (experimental)

For an easy quick start, launch a Gitpod development version of the development environment.

Open Gitpod in "Open in VS Code on Desktop", then verify the ports `3000`, `8080` and `4566` are being forwarded by VS Code in the "Ports" tab of VS Code. You should then be able to load the app at localhost:3000.

If you want to set a custom .env file for your personal settings and address, edit `.env` and then save it to your Gitpod profile with

```
gp env DOTENV="$(base64 .env | tr -d '\n')"
```

See `.gitpod.yml` for details on how Gitpod works.

# Troubleshooting

- `Cannot start service app: error while creating mount source path`
  Try restarting Docker Desktop

- `TypeError: Cannot read properties of undefined (reading 'replace')`
  You need to configure a local `.env` file with some private variables. Ask someone for these.
