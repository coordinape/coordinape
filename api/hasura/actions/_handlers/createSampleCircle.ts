import faker from '@faker-js/faker';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime } from 'luxon';

import { COORDINAPE_USER_ADDRESS } from '../../../../api-lib/config';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import * as mutations from '../../../../api-lib/gql/mutations';
import {
  UnauthorizedError,
  UnprocessableError,
} from '../../../../api-lib/HttpError';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import { composeHasuraActionRequestBodyWithoutPayload } from '../../../../src/lib/zod';

type CircleInput = Parameters<typeof mutations.insertCircleWithAdmin>[0];

const MEMBER_COUNT = 8;
const CONTRIBUTION_MAX = 8;

const sampleCircleDefaults: CircleInput = {
  user_name: 'Me',
  circle_name: 'Sample DAO Core Circle',
  organization_name: 'Sample DAO',
  sampleOrg: true,
};

async function handler(req: VercelRequest, res: VercelResponse) {
  const { session_variables: sessionVariables } =
    composeHasuraActionRequestBodyWithoutPayload().parse(req.body);
  if (sessionVariables.hasuraRole == 'admin') {
    throw new UnauthorizedError(
      `Sample circle creation can only be performed by non-admin users`
    );
  }

  const ret = await createSampleCircleForProfile(
    sessionVariables.hasuraProfileId,
    sessionVariables.hasuraAddress
  );

  return res.status(200).json(ret);
}

export const createSampleCircleForProfile = async (
  profileID: number,
  address: string
) => {
  // if the org already exists and was created by this profile, we want to use that org ID
  const { organizations } = await adminClient.query({
    organizations: [
      {
        where: {
          sample: { _eq: true },
          created_by: { _eq: profileID },
        },
      },
      {
        id: true,
      },
    ],
  });

  const organization_id: number | undefined = organizations.pop()?.id;

  // if the circle already exists, thats a problem!
  if (organization_id) {
    // org exists, lets check for any non-deleted circles
    const { circles_aggregate } = await adminClient.query({
      circles_aggregate: [
        {
          where: {
            organization_id: { _eq: organization_id },
            deleted_at: { _is_null: true },
          },
        },
        {
          aggregate: {
            count: [{}, true],
          },
        },
      ],
    });

    if ((circles_aggregate.aggregate?.count ?? 0) > 0) {
      // the sample org exists and it has at least 1 non-deleted circle
      // this means we don't want to rebuild
      throw new UnprocessableError('sample org and circle already exist');
    }
  }

  const ret = await createCircle(address, profileID, organization_id);
  return ret;
};

async function createCircle(
  userAddress: string,
  userProfileId: number,
  organization_id: number | undefined
) {
  const circle = await mutations.insertCircleWithAdmin(
    { organization_id, ...sampleCircleDefaults },
    userAddress,
    userProfileId,
    COORDINAPE_USER_ADDRESS,
    '' // TODO??
  );

  if (!circle) {
    throw new Error('circle creation failed');
  }

  // make epoch (recurring weekly?)

  const start_date = DateTime.now();
  const end_date = DateTime.now().plus({ days: 7 });

  const { insert_epochs_one } = await adminClient.mutate(
    {
      insert_epochs_one: [
        {
          object: {
            start_date: start_date.toISO(),
            end_date: end_date.toISO(),
            circle_id: circle.id,
            repeat: 3,
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'createEpoch_insert',
    }
  );

  if (!insert_epochs_one) {
    throw new Error('epoch creation failed');
  }

  // TODO: faker seed
  // add a bunch of members
  const members = await Promise.all(
    [...Array(MEMBER_COUNT).keys()].map(() => addSampleMember(circle.id))
  );

  // add contributions
  const contributionMutations: Promise<number>[] = [];
  for (const m of members) {
    contributionMutations.push(
      ...[
        ...Array(
          faker.datatype.number({ min: 0, max: CONTRIBUTION_MAX })
        ).keys(),
      ].map(() => addSampleContribution(circle.id, m.user_id))
    );
  }
  await Promise.all(contributionMutations);

  const allocationTargets = [
    { user_id: circle.users[0].id, address: userAddress },
    ...members,
  ];

  // add allocations
  const allocateMutations: Promise<void>[] = [];
  for (const m of members) {
    allocateMutations.push(
      ...allocateFully({
        sender_address: m.address,
        user_id: m.user_id,
        circle_id: circle.id,
        epoch_id: insert_epochs_one.id,
        targets: allocationTargets,
      })
    );
  }
  await Promise.all(allocateMutations);

  await mutations.insertInteractionEvents({
    event_type: 'circle_create',
    circle_id: circle?.id,
    profile_id: userProfileId,
  });

  return circle;
}

const addSampleMember = async (
  circle_id: number
): Promise<{ user_id: number; address: string }> => {
  const address = faker.finance.ethereumAddress();
  const { insert_users_one } = await adminClient.mutate({
    insert_users_one: [
      {
        object: {
          address,
          bio: faker.hacker.phrase(),
          circle_id,
          name: faker.name.firstName(),
        },
      },
      {
        id: true,
      },
    ],
  });
  if (!insert_users_one) {
    throw new Error('insert sample user failed');
  }
  return { user_id: insert_users_one.id, address };
};

const addSampleContribution = async (circle_id: number, user_id: number) => {
  const { insert_contributions_one } = await adminClient.mutate({
    insert_contributions_one: [
      {
        object: {
          circle_id,
          user_id,
          description: faker.hacker.phrase(),
        },
      },
      {
        id: true,
      },
    ],
  });
  if (!insert_contributions_one) {
    throw new Error('insert sample contribution failed');
  }
  return insert_contributions_one.id;
};
//
// const addSampleAllocation = async (circle_id: number, user_id: number) => {
//   const { insert_contributions_one } = await adminClient.mutate({
//     insert_contributions_one: [
//       {
//         object: {
//           circle_id,
//           user_id,
//           description: faker.hacker.phrase(),
//         },
//       },
//       {
//         id: true,
//       },
//     ],
//   });
//   if (!insert_contributions_one) {
//     throw new Error('insert sample contribution failed');
//   }
//   return insert_contributions_one.id;
// };

const allocateFully = ({
  circle_id,
  user_id,
  targets,
  epoch_id,
  sender_address,
}: {
  circle_id: number;
  user_id: number;
  targets: { user_id: number; address: string }[];
  epoch_id: number;
  sender_address: string;
}) => {
  let membersRemaining = targets.length;
  const giveRemaining = 100;

  const randomTargets = faker.random.arrayElements(targets, targets.length);
  return randomTargets.map(t => {
    let amount = faker.datatype.number({
      min: 1,
      max: 100 / (membersRemaining / 2),
    });
    if (membersRemaining === 1 || amount > giveRemaining) {
      amount = giveRemaining;
    }

    const note = faker.hacker.phrase();

    membersRemaining--;
    return new Promise<void>(resolve => {
      adminClient
        .mutate({
          insert_pending_token_gifts_one: [
            {
              object: {
                recipient_id: t.user_id,
                note: note,
                circle_id,
                epoch_id: epoch_id,
                sender_id: user_id,
                sender_address: sender_address,
                recipient_address: t.address,
                tokens: amount,
              },
            },
            { __typename: true },
          ],
        })
        .then(() => resolve());
      return;
    });
  });
};

export default verifyHasuraRequestMiddleware(handler);
