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

# Getting started:

- `git clone` | `yarn install`
- Setup .env file
- `yarn start` | [http://localhost:3000](http://localhost:3000)

Bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# App Structure

### See [HistoryPage](https://github.com/coordinape/coordinape/blob/master/src/pages/HistoryPage/HistoryPage.tsx) as an exemplar top level component.

## Key libraries

- Recoil
- Material UI
- ethers
- axios
- Luxon
  - Prefered over deprecated momentum for timezone support
- Sentry (error reporting)
- d3-force-3d
  - See forked `canvas-color-tracker` for brave compatibility

## State Management w/ [Recoil](https://recoiljs.org/)

Recoil defines a consistent data graph that will suspend the app when `useRecoilState(rIdentifier)` has an unresolved promise. See their video and documentation.

The basic distinction is between `atoms` and `selectors`. `selectors` will be rerun when any of their dependencies change and with each run the dependency list can change, unlike with hooks. `atomFamily` and `selectorFamily` allow parameterization.

## Recoil in this app

- Recoil identifiers are Global
- See: `RecoilAppController` for global recoil initialization with `useEffect`
- Create hooks e.g.
  - `useSelectedCircle = () => useRecoilValue(rSelectedCircle);`
- Advanced Recoil concepts:
  - [useRecoilCallback](https://recoiljs.org/docs/api-reference/core/useRecoilCallback)
  - [effects_UNSTABLE](https://recoiljs.org/docs/guides/atom-effects)

## API requests

- Types are currently manually matched to our server
  - e.g. `api.epoch.d.ts` and post params: `api.d.ts`
- `const callWithLoadCatch = useAsyncLoadCatch()`
  - standard wrapper that can trigger loading and error message
  - `callWithLoadCatch(async () => api.putCircles(id, addr, params) );`
- Most app data loaded in `useCircle().selectAndFetchCircle()`
  - `useRecoilFetcher` caches results w/ stale threshold
  - merges into results into id keyed maps

## Forms

@exrhizo developed a in house form lib inspired by [React Hook Form](https://react-hook-form.com/) with the intention of easy customization.

- Forms are configured with a [Zod](https://github.com/colinhacks/zod) Parser
- See `AdminUserForm` for a simple use
- Doesn't have first class support of array fields

# Troubleshooting

- `TypeError: Cannot read properties of undefined (reading 'replace')`
  You need to configure a local `.env` file with some private variables. Ask someone for these.

- `error: no template named 'remove_cv_t' in namespace 'std'; did you mean 'remove_cv'`
  Probably related to node-sass versions. Node v16 only works with node-sass 6.0.1 or newer. https://github.com/sass/node-sass/issues/3077

### Credits

ascii art above: [image](https://www.asciiart.eu/animals/monkeys) - [font](https://textpaint.net/)
