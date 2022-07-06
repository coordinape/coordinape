import { GraphQLTypes, InputType, Selector } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

export const circleApiPermissionsSelector = Selector('circle_api_keys')({
  read_circle: true,
  read_nominees: true,
  read_pending_token_gifts: true,
  read_member_profiles: true,
  read_epochs: true,
  update_circle: true,
  update_pending_token_gifts: true,
  create_vouches: true,
});

export const circleApiKeySelector = Selector('circle_api_keys')({
  hash: true,
  name: true,
  createdByUser: {
    name: true,
  },
  ...circleApiPermissionsSelector,
});

export function useCircleApiKeys(circleId: number | undefined) {
  return useQuery(
    ['circle-api-keys', circleId],
    async () => {
      const { circle_api_keys } = await client.query(
        {
          circle_api_keys: [
            {
              where: { circle_id: { _eq: circleId } },
            },
            circleApiKeySelector,
          ],
        },
        {
          operationName: 'getCircleApiKeys',
        }
      );
      return circle_api_keys;
    },
    { enabled: !!circleId }
  );
}

export type CircleApiKeysResponse = InputType<
  GraphQLTypes['circle_api_keys'],
  typeof circleApiKeySelector
>;

export type CircleApiPermissions = InputType<
  GraphQLTypes['circle_api_keys'],
  typeof circleApiPermissionsSelector
>;
