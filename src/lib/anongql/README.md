# @coordinape/anongql

Anonymous GraphQL client for Hasura, designed to work with GraphQL Zeus.

## Installation

```bash
npm install @coordinape/anongql
# or
yarn add @coordinape/anongql
# or
pnpm add @coordinape/anongql
```

## Configuration

The client will look for your Hasura URL in the following places (in order):
1. `process.env.VITE_HASURA_URL` - Node.js environment
2. `window.env.VITE_HASURA_URL` - Browser global
3. `import.meta.env.VITE_HASURA_URL` - Vite/modern bundlers
4. Default fallback: `http://localhost:8080/v1/graphql`

Make sure to set the `VITE_HASURA_URL` environment variable in your application.

## Usage

```typescript
import { anonClient } from '@coordinape/anongql';

// Query example
const result = await anonClient.query({
  profiles: [
    {
      where: { address: { _eq: '0x123...' } }
    },
    {
      id: true,
      name: true,
      address: true
    }
  ]
}, {
  operationName: 'GetProfile'
});

// Advanced usage with custom headers
import { ThunderRequireOperationName } from '@coordinape/anongql';
import { apiFetch } from 'graphql-zeus';

const customClient = ThunderRequireOperationName(async (...params) => {
  return apiFetch([
    'https://your-hasura-url.com/v1/graphql',
    {
      method: 'POST',
      headers: {
        'Hasura-Client-Name': 'custom-client',
        Authorization: 'Bearer your-token',
      },
    },
  ])(...params);
})('query');

// Using with React and GraphQL subscriptions
import { useTypedSubscription } from '@coordinape/anongql';

function ProfileUpdates() {
  const { data, loading, error } = useTypedSubscription({
    profiles: [
      { 
        where: { updated_at: { _gt: "2023-01-01" } } 
      },
      {
        id: true,
        name: true,
        updated_at: true
      }
    ]
  }, {
    // Apollo subscription options
  }, {
    operationName: 'ProfileUpdates'
  });
  
  return /* rendering logic */;
}
```

## GitHub Installation

You can install directly from GitHub:

```bash
npm install coordinape/coordinape#main:src/lib/anongql
# or for a specific branch
npm install coordinape/coordinape#branch-name:src/lib/anongql
```

## License

MIT