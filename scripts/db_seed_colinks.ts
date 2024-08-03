import assert from 'assert';

import { faker } from '@faker-js/faker';

import { LOCAL_SEED_ADDRESS } from '../api-lib/config';
import {
  cosouls_constraint,
  link_tx_constraint,
  profiles_constraint,
  profiles_update_column,
} from '../api-lib/gql/__generated__/zeus';
import { adminClient } from '../api-lib/gql/adminClient';
import { getCoLinksContract } from '../src/features/colinks/api/colinks';
import {
  calculateLinkAmountFromTransactions,
  updateLinkHoldersTable,
} from '../src/features/colinks/api/updateHolders';
import {
  getTokenId,
  mintCoSoulForAddress,
} from '../src/features/cosoul/api/cosoul';
import { Contracts } from '../src/features/cosoul/contracts';
import { provider } from '../src/utils/testing/provider';
import { unlockSigner } from '../src/utils/testing/unlockSigner';

const NUMBER_OF_USERS = 5;
type User = {
  name: string;
  address: string;
  tokenId: number | undefined;
  txHash: string | undefined;
};

async function createProfiles(users: User[]) {
  const profiles: { id: number }[] = [];
  for (let i = 0; i < users.length; i++) {
    const {
      profiles: [existingProfile],
    } = await adminClient.query(
      {
        profiles: [
          {
            where: { address: { _ilike: users[i].address } },
          },
          {
            id: true,
          },
        ],
      },
      { operationName: 'colinks_seed__getprofile' }
    );

    if (!existingProfile?.id) {
      const { insert_profiles_one: profile } = await adminClient.mutate(
        {
          insert_profiles_one: [
            {
              object: {
                address: users[i].address.toLowerCase(),
                name: users[i].name,
                description: faker.lorem.sentence(),
              },
              on_conflict: {
                constraint: profiles_constraint.profiles_pkey,
                update_columns: [
                  profiles_update_column.address,
                  profiles_update_column.name,
                  profiles_update_column.description,
                ],
                where: {
                  name: { _is_null: true },
                },
              },
            },
            {
              id: true,
            },
          ],
        },
        { operationName: 'colinks_seed__insertProfile' }
      );

      assert(profile, 'failed to insert profile');
      profiles.push(profile);
    } else {
      profiles.push(existingProfile);
    }
  }
  return profiles;
}

async function insertCosouls(users: User[]) {
  // mint for the first account
  const mainUserTokenId = await getTokenId(users[0].address);
  if (!mainUserTokenId) {
    const tx = await contract.mint();
    users[0].tokenId = await getTokenId(users[0].address);
    users[0].txHash = tx.hash;
  } else {
    users[0].tokenId = mainUserTokenId;
    users[0].txHash = users[0].address; //just for testing
  }

  // mint for the rest of the accounts
  for (let i = 1; i < users.length; i++) {
    const user = users[i];
    const tokenId = await getTokenId(user.address);
    if (!tokenId) {
      const tx = await mintCoSoulForAddress(user.address);
      users[i].tokenId = await getTokenId(user.address);
      users[i].txHash = tx.hash;
    } else {
      users[i].tokenId = tokenId;
      users[i].txHash = users[i].address; //just for testing
    }
  }

  await adminClient.mutate(
    {
      insert_cosouls: [
        {
          objects: [
            ...users.map(user => ({
              created_tx_hash: user.txHash,
              token_id: user.tokenId,
              address: user.address.toLowerCase(),
              checked_at: null,
              pgive: 1,
            })),
          ],
          on_conflict: {
            constraint: cosouls_constraint.cosouls_token_id_key,
            update_columns: [],
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'colinks_seed__insertCoSoul',
    }
  );
}

async function buyLinks(users: User[]) {
  const coLinks = getCoLinksContract();
  const devSigner = await unlockSigner(LOCAL_SEED_ADDRESS);
  const links = [];
  links.push(coLinks.connect(provider().getSigner(users[0].address)));
  links.push(coLinks.connect(provider().getSigner(users[1].address)));
  links.push(coLinks.connect(provider().getSigner(users[2].address)));
  links.push(coLinks.connect(provider().getSigner(users[3].address)));
  links.push(coLinks.connect(provider().getSigner(users[4].address)));
  links.push(coLinks.connect(devSigner));
  //buy own links
  for (let i = 0; i < users.length; i++) {
    const linkBalance = await links[i].linkBalance(
      users[i].address,
      users[i].address
    );
    if (linkBalance.toNumber() > 0) continue;
    const linkSupply = await links[i].linkSupply(users[i].address);
    const value = await links[i].getBuyPriceAfterFee(users[i].address, 1);
    const colink = await links[i].buyLinks(users[i].address, 1, { value });
    await adminClient.mutate(
      {
        insert_link_tx_one: [
          {
            object: {
              tx_hash: colink.hash.toLowerCase(),
              holder: users[i].address.toLowerCase(),
              target: users[i].address.toLowerCase(),
              buy: true,
              link_amount: '1',
              eth_amount: '0',
              protocol_fee_amount: '0',
              target_fee_amount: '0',
              supply: linkSupply.toNumber() + 1,
            },
            on_conflict: {
              constraint: link_tx_constraint.key_tx_pkey,
              update_columns: [], // ignore if we already got it
            },
          },
          {
            __typename: true,
          },
        ],
      },
      {
        operationName: 'colinks_seed__insert_link_tx',
      }
    );

    const holderTargetBalance = await calculateLinkAmountFromTransactions(
      users[i].address.toLowerCase(),
      users[i].address.toLowerCase()
    );

    const holderTarget = {
      amount: holderTargetBalance,
      holder: users[i].address.toLowerCase(),
      target: users[i].address.toLowerCase(),
    };

    await updateLinkHoldersTable(holderTarget);
  }

  //buy others links
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users.length; j++) {
      const linkSupply = await links[i].linkSupply(users[j].address);
      const value = await links[i].getBuyPriceAfterFee(users[j].address, 1);
      const colink = await links[i].buyLinks(users[j].address, 1, { value });
      await adminClient.mutate(
        {
          insert_link_tx_one: [
            {
              object: {
                tx_hash: colink.hash.toLowerCase(),
                holder: users[i].address.toLowerCase(),
                target: users[j].address.toLowerCase(),
                buy: true,
                link_amount: '1',
                eth_amount: value.toString(),
                protocol_fee_amount: '0',
                target_fee_amount: '0',
                supply: linkSupply.toNumber() + 1,
              },
              on_conflict: {
                constraint: link_tx_constraint.key_tx_pkey,
                update_columns: [], // ignore if we already got it
              },
            },
            {
              __typename: true,
            },
          ],
        },
        {
          operationName: 'colinks_seed__insert_link_tx',
        }
      );

      const holderTargetBalance = await calculateLinkAmountFromTransactions(
        users[i].address.toLowerCase(),
        users[j].address.toLowerCase()
      );

      const holderTarget = {
        amount: holderTargetBalance,
        holder: users[i].address.toLowerCase(),
        target: users[j].address.toLowerCase(),
      };

      await updateLinkHoldersTable(holderTarget);
    }
  }
}

async function addPosts(profiles: { id: number }[]) {
  const { insert_contributions: contributions } = await adminClient.mutate(
    {
      insert_contributions: [
        {
          objects: profiles.map(p => ({
            profile_id: p.id,
            user_id: undefined,
            private_stream: true,
            description: faker.lorem.sentence(),
          })),
        },
        { returning: { id: true, profile_id: true } },
      ],
    },
    { operationName: 'colinks_seed__addContributions' }
  );

  assert(contributions?.returning, 'contributions are not inseted');

  //cron disabled and these are inserted manually because it may not be ready at the time of inseting replies
  const { insert_activities: activities } = await adminClient.mutate(
    {
      insert_activities: [
        {
          objects: contributions.returning.map(c => ({
            actor_profile_id: c.profile_id,
            contribution_id: c.id,
            private_stream: true,
            user_id: undefined,
            action: 'contributions_insert',
          })),
        },
        { returning: { id: true, actor_profile_id: true } },
      ],
    },
    { operationName: 'colinks_seed__getActivitiesdata' }
  );
  assert(activities?.returning, 'activities not found');
  const replies = [];
  for (const profile of profiles) {
    for (const activity of activities.returning) {
      replies.push({
        profile_id: profile.id,
        activity_id: activity.id,
        activity_actor_id: activity.actor_profile_id,
        reply: faker.lorem.sentence(),
      });
    }
  }

  await adminClient.mutate(
    {
      insert_replies: [
        {
          objects: replies,
        },
        { returning: { id: true } },
      ],
    },
    { operationName: 'colinks_seed__addReplies' }
  );
}

const accounts = await provider().listAccounts();
const users: User[] = new Array(NUMBER_OF_USERS).fill(null).map((_, idx) => ({
  name: faker.unique(faker.name.firstName),
  address: accounts[idx].toLowerCase(),
  tokenId: undefined,
  txHash: undefined,
}));
users.push({
  name: 'Mee',
  address: LOCAL_SEED_ADDRESS.toLowerCase(),
  tokenId: undefined,
  txHash: undefined,
});
const contract = (await Contracts.fromProvider(provider())).cosoul;

const profiles = await createProfiles(users);
await insertCosouls(users);
await buyLinks(users);
await addPosts(profiles);
