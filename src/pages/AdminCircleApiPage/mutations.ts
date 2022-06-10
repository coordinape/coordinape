import { ValueTypes } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';

import { circleApiKeySelector } from './useCircleApiKeys';

export async function generateCircleApiKey(
  params: ValueTypes['GenerateApiKeyInput']
) {
  const { generateApiKey } = await client.mutate(
    {
      generateApiKey: [
        {
          payload: {
            ...params,
          },
        },
        {
          api_key: true,
          hash: true,
          circleApiKey: circleApiKeySelector,
        },
      ],
    },
    {
      operationName: 'generateApiKey',
    }
  );
  return generateApiKey;
}

export async function deleteCircleApiKey(hash: string) {
  const { delete_circle_api_keys_by_pk } = await client.mutate(
    {
      delete_circle_api_keys_by_pk: [
        {
          hash,
        },
        { hash: true },
      ],
    },
    {
      operationName: 'deleteApiKey',
    }
  );
  return delete_circle_api_keys_by_pk;
}
