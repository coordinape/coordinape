```
┏━━━┓━━━━━━━━━━━━━┏┓━━━━━━━━━━━━━━━━━━━
┃┏━┓┃━━━━━━━━━━━━━┃┃━━━━━━━━━━━━━━━━━━━
┃┃━┗┛┏━━┓┏━━┓┏━┓┏━┛┃┏┓┏━┓━┏━━┓━┏━━┓┏━━┓
┃┃━┏┓┃┏┓┃┃┏┓┃┃┏┛┃┏┓┃┣┫┃┏┓┓┗━┓┃━┃┏┓┃┃┏┓┃
┃┗━┛┃┃┗┛┃┃┗┛┃┃┃━┃┗┛┃┃┃┃┃┃┃┃┗┛┗┓┃┗┛┃┃┃━┫
┗━━━┛┗━━┛┗━━┛┗┛━┗━━┛┗┛┗┛┗┛┗━━━┛┃┏━┛┗━━┛
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┃┃━━━━━━
React Frontend + GraphQL API   ┃┃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┗┛━━━━━━
                __------__
              /~          ~\
             |    //^\\//^\|
           /~~\  ||  o| |o|:~\
          | |6   ||___|_|_||:|
           \__.  /      o  \/'
            |   (       O   )
   /~~~~\    `\  \         /
  | |~~\ |     )  ~------~`\
 /' |  | |   /     ____ /~~~)\
(_/'   | | |     /'    |    ( |
       | | |     \    /   __)/ \
       \  \ \      \/    /' \   `\
         \  \|\        /   | |\___|
           \ |  \____/     | |
           /^~>  \        _/ <
          |  |         \       \
          |  | \        \        \
          -^-\  \       |        )
               `\_______/^\______/
```

# Getting started

Stack: **React**, **Hasura** graphql server & **vercel** serverless functions

### Prerequisites

- NodeJS v14
- Hasura cli version >= 2.1.1
- Yarn
- Docker
- Vercel CLI

## Coordinape is being rebuilt

- Laravel → Hasura & Vercel serverless functions
- Material UI → Stitches + React-Query & Zeus

# Quick Start

- `yarn install`
- `yarn setup`
  - init git submodules, link hardhat & create prisma node_modules
- `npx prisma generate` - setup prisma node modules
- `cp .env.example .env`
  - Set `HARDHAT_OWNER_ADDRESS` and `LOCAL_SEED_ADDRESS` to your local dev wallet
- `yarn docker:start` - Start **laravel** legacy backend, **Hasura** and **postgres**
  - Clear the data stored in the docker volumes: `yarn docker:clean`
  - First time laravel is slow.
- `yarn db-seed-fresh` - Seed the db w/ dummy data
  > ⚠️ Don't seed the database with `vercel dev` running
- `vercel dev`
  - First time setup: `Want to override the settings`? `Y`
  - Runs React and the serverless functions in `api/`
- Goto: http://localhost:3000 and starting giving!

### Storybook

- `yarn storybook`

### Working with the schema

- `yarn hasura console` to modify and explore the database
- `yarn generate` after schema changes to codegen zeus & react-query libs
- Requires the `vercel dev` serverless functions to be running

# Hardhat

- Set `ETHEREUM_RPC_URL` in .env
  - From Infura project id: [Infura](https://infura.io) & create new project
- `yarn hardhat:dev`

#### Additionally

- `./scripts/setup.sh` - link the react app generated code
- `./scripts/rebuild-hardhat.sh` - Rebuild the generated code
- `yarn hardhat:test` - Run tests
  - make sure `HARDHAT_FORK_BLOCK` is set (13500000 is a good value) and `ETHEREUM_RPC_URL` points to an archive node

# Hasura

[Hasura](https://hasura.io/)
automagically creates a
[GraphQL API](https://hasura.io/learn/graphql/hasura/data-modeling/2-try-user-queries/)
atop our postgres db. We use it to apply
[migrations](https://hasura.io/learn/graphql/hasura-advanced/migrations-metadata/2-migration-files/)
and
[manage metadata](https://hasura.io/learn/graphql/hasura-advanced/migrations-metadata/3-metadata/).
Perhaps, the easiest way to get a feel is start the app and run `yarn hasura console`.

## Changes to the schema are previewed in PRs with vercel

Any changes you make in the Console will be reflected in your local `hasura` directory as migrations or metadata. In the feature branch a clone of the staging database will be created with the changes.

These will be applied to the staging/production instance once merged via PR.

## Thin Client

Inspired by the [3factor app](https://3factor.app).
We are building thin client with business logic using serverless functions and postgres constraints.

- Actions
- Mutations
- Triggers
- Cron jobs
- Constraints

Server logic in typescript, configured with hasura, deployed by vercel.

# React App

Bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Key libraries

- Recoil
- Material UI
- ethers
- axios
- Luxon
- Sentry (error reporting)
- d3-force-3d
  - See forked `canvas-color-tracker` for brave compatibility

## State Management w/ [Recoil](https://recoiljs.org/)

Moving towards Zeus+React-Query

Recoil defines a consistent data graph that will suspend the app when `useRecoilState(rIdentifier)` has an unresolved promise. See their video and documentation.

The basic distinction is between `atoms` and `selectors`. `selectors` will be rerun when any of their dependencies change and with each run the dependency list can change, unlike with hooks. `atomFamily` and `selectorFamily` allow parameterization.

## Recoil in this app

- Recoil identifiers are Global
- Prefer to minimize atoms and selectors now
- Most data consolidated into profile & circle state
  - `useSelectedCircle` & `useMyProfile`
- Advanced Recoil concepts:
  - [useRecoilCallback](https://recoiljs.org/docs/api-reference/core/useRecoilCallback)
  - [effects_UNSTABLE](https://recoiljs.org/docs/guides/atom-effects)

## API requests

- Types are currently manually matched to our server
  - e.g. `api.epoch.d.ts` and post params: `api.d.ts`
- `const useRecoilLoadCatch()`
  - standard wrapper that can trigger loading and error message
- App data loaded in `useApiBase`
  - `fetchManifest` `fetchCircle` `fetchProfile`

## Forms

@exrhizo developed a in house form lib inspired by [React Hook Form](https://react-hook-form.com/) with the intention of easy customization. Perhaps too
clever.

- Forms are configured with a [Zod](https://github.com/colinhacks/zod) Parser
- See `AdminUserForm` for a simple use
- Doesn't have first class support of array fields

# Useful tricks

Setup docker, git, hasura completions.

### Docker

- Install VS Code's docker extension
- `docker ps` - see the running containers
- `docker logs coordinape_graphql-engine_1 | jq -C | less -r`
  - jq parses the hasura log output as colorized json
- `docker exec -it app bash` - Create a shell in the container

# Troubleshooting

- `Cannot start service app: error while creating mount source path`
  Try restarting Docker Desktop

- `TypeError: Cannot read properties of undefined (reading 'replace')`
  You need to configure a local `.env` file with some private variables. Ask someone for these.

- `error: no template named 'remove_cv_t' in namespace 'std'; did you mean 'remove_cv'`
  Probably related to node-sass versions. Node v16 only works with node-sass 6.0.1 or newer. https://github.com/sass/node-sass/issues/3077

- `Laravel in Docker always restarting (Windows)`
  When log says `start.sh : not found` Change the line ending of `Laravel/services/start.sh` from CRLF to LF.

### Credits

ascii art above: [image](https://www.asciiart.eu/animals/monkeys) - [font](https://textpaint.net/)
