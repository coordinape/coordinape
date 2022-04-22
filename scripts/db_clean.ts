import { ValueTypes } from '../api-lib/gql/__generated__/zeus';
import { adminClient } from '../api-lib/gql/adminClient';

type MutationName = keyof ValueTypes['mutation_root'];

async function run() {
  const mutations: Record<string, MutationName> = {
    token_gifts: 'delete_token_gifts',
    pending_token_gifts: 'delete_pending_token_gifts',
    teammates: 'delete_teammates',
    vouches: 'delete_vouches',
    nominees: 'delete_nominees',
    user: 'delete_users',
    epoch: 'delete_epochs',
    circle: 'delete_circles',
    organizations: 'delete_organizations',
    profile: 'delete_profiles',
  };

  const events: string[] = [];

  for (const [name, mutation] of Object.entries(mutations)) {
    const res = await adminClient.mutate(
      {
        [mutation]: [{ where: {} }, { affected_rows: true }],
      },
      {
        operationName: 'db-clean',
      }
    );

    // @ts-ignore
    const count = res[mutation]?.affected_rows;
    if (typeof count === 'number') {
      events.push(`Deleted ${count} from ${name}`);
    } else {
      throw `Failed to deleteMany.`;
    }
  }

  console.log("Coordinape destroyed, I hope you're happy.", events);
}

(async function () {
  await run()
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .then(() => {
      process.exit(0);
    });
})();
