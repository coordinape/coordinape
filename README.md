```
┏━━━┓━━━━━━━━━━━━━┏┓━━━━━━━━━━━━━━━━━━━
┃┏━┓┃━━━━━━━━━━━━━┃┃━━━━━━━━━━━━━━━━━━━
┃┃━┗┛┏━━┓┏━━┓┏━┓┏━┛┃┏┓┏━┓━┏━━┓━┏━━┓┏━━┓
┃┃━┏┓┃┏┓┃┃┏┓┃┃┏┛┃┏┓┃┣┫┃┏┓┓┗━┓┃━┃┏┓┃┃┏┓┃
┃┗━┛┃┃┗┛┃┃┗┛┃┃┃━┃┗┛┃┃┃┃┃┃┃┃┗┛┗┓┃┗┛┃┃┃━┫
┗━━━┛┗━━┛┗━━┛┗┛━┗━━┛┗┛┗┛┗┛┗━━━┛┃┏━┛┗━━┛
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┃┃━━━━━━
React Frontend                 ┃┃
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

## Prerequisites

- NodeJS version 14
- A backend API to connect this frontend app to. This app connects to the backend defined in REACT_APP_API_BASE_URL in the `.env` file. To setup the coordinape-backend app locally and use that as your API, [follow the instructions.](https://github.com/coordinape/coordinape-backend/blob/main/README.md)
  - You can optionally use `https://staging-api.coordinape.com/api` if you don't want to run your API locally
- An Infura project id: [Infura](https://infura.io)
  - After you sign up for an account, go to Ethereum > Create New Project and the project ID will be available on the settings page
- A browser with MetaMask installed (it's the officially supported wallet)

## Install instructions

1. Clone the git repo: `git clone git@github.com:coordinape/coordinape.git`
2. Install packages: `yarn install`
3. Setup a local .env file: `cp .env.example .env`
   - set `REACT_APP_INFURA_PROJECT_ID` to your Infura project ID (see Prerequisites)
   - set `REACT_APP_API_BASE_URL` to your API URL
4. Start yarn: `yarn start`
5. Visit app: [http://localhost:3000](http://localhost:3000)

# App Structure

Bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### See [HistoryPage](https://github.com/coordinape/coordinape/blob/master/src/pages/HistoryPage/HistoryPage.tsx) as an exemplar top level component.

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

## Hardhat

1. Install packages: `yarn hardhat:install`
2. Make sure `ETHEREUM_RPC_URL` is defined in your `.env` file
3. Load contracts: `git submodule update --init --recursive`
4. Build hardhat: `yarn hardhat:build`
5. Run tests: `yarn hardhat:test`
6. Deploy and start testnet: `yarn hardhat:dev`
7. Check testnet accounts: `yarn --cwd hardhat hardhat accounts`

# Troubleshooting

- `TypeError: Cannot read properties of undefined (reading 'replace')`
  You need to configure a local `.env` file with some private variables. Ask someone for these.

- `error: no template named 'remove_cv_t' in namespace 'std'; did you mean 'remove_cv'`
  Probably related to node-sass versions. Node v16 only works with node-sass 6.0.1 or newer. https://github.com/sass/node-sass/issues/3077

### Credits

ascii art above: [image](https://www.asciiart.eu/animals/monkeys) - [font](https://textpaint.net/)
