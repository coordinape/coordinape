import { ValueTypes } from '../api-lib/gql/__generated__/zeus';
import { adminClient } from '../api-lib/gql/adminClient';

type MutationName = keyof ValueTypes['mutation_root'];

(async () => {
  const mutations: MutationName[] = [
    'delete_contributions',
    'delete_vault_transactions',
    'delete_pending_vault_transactions',
    'delete_claims',
    'delete_distributions',
    'delete_vaults',
    'delete_token_gifts',
    'delete_pending_token_gifts',
    'delete_teammates',
    'delete_vouches',
    'delete_nominees',
    'delete_circle_api_keys',
    'delete_users',
    'delete_epochs',
    'delete_circle_integrations',
    'delete_circle_share_tokens',
    'delete_circles',
    'delete_organizations',
    'delete_profiles',
    'delete_burns',
    'delete_circle_api_keys',
    'delete_circle_integrations',
    'delete_circle_metadata',
    'delete_gift_private',
    'delete_histories',
  ];

  for (const mutation of mutations) {
    const res = await adminClient.mutate(
      {
        [mutation]: [{ where: {} }, { affected_rows: true }],
      },
      {
        operationName: 'db_clean',
      }
    );

    // @ts-ignore
    const count = res[mutation]?.affected_rows;
    if (typeof count !== 'number') throw `Failed to run ${mutation}`;
    console.log(`${mutation}: ${count}`); // eslint-disable-line
  }
})()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
