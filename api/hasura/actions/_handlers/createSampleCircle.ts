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

import {
  sampleCircleDefaults,
  SampleMember,
  sampleMembers,
} from './createSampleCircle_data';

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

  // make the members in parallel, assign user_id and address
  await Promise.all(sampleMembers.map(sm => addSampleMember(circle.id, sm)));

  // make the contributions in parallel
  await Promise.all(
    sampleMembers.map(sm =>
      // safe to assert user_id here because it was generated above
      sm.contributions.map(c =>
        addSampleContribution(circle.id, sm.user_id!, c)
      )
    )
  );

  await Promise.all(
    sampleMembers.map(sm =>
      Object.keys(sm.gifts).map(recipIdx => {
        const recip: { address?: string; user_id?: number } =
          +recipIdx === 0
            ? { address: userAddress, user_id: circle.users[0].id }
            : sampleMembers.find(sm => sm.index == +recipIdx)!;
        const recipGift = sm.gifts[+recipIdx];
        return addSampleAllocation(
          circle.id,
          insert_epochs_one.id,
          sm.user_id!,
          sm.address!,
          recip.user_id!,
          recip.address!,
          recipGift.gift,
          recipGift.note
        );
      })
    )
  );

  await mutations.insertInteractionEvents({
    event_type: 'sample_circle_create',
    circle_id: circle?.id,
    profile_id: userProfileId,
  });

  return circle;
}

const addSampleMember = async (
  circle_id: number,
  sampleMember: SampleMember
): Promise<{ user_id: number; address: string }> => {
  const address = faker.finance.ethereumAddress();
  const { insert_users_one } = await adminClient.mutate({
    insert_users_one: [
      {
        object: {
          address,
          bio: sampleMember.epochStatement,
          circle_id,
          name: sampleMember.name,
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
  sampleMember.address = address;
  sampleMember.user_id = insert_users_one.id;

  return { user_id: insert_users_one.id, address };
};

const addSampleContribution = async (
  circle_id: number,
  user_id: number,
  contribution: string
) => {
  const { insert_contributions_one } = await adminClient.mutate({
    insert_contributions_one: [
      {
        object: {
          circle_id,
          user_id,
          description: contribution,
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
const addSampleAllocation = async (
  circle_id: number,
  epoch_id: number,
  user_id: number,
  sender_address: string,
  recipient_id: number,
  recipient_address: string,
  gift: number,
  note?: string
) => {
  const { insert_pending_token_gifts_one } = await adminClient.mutate({
    insert_pending_token_gifts_one: [
      {
        object: {
          recipient_id: recipient_id,
          note: note,
          circle_id,
          epoch_id: epoch_id,
          sender_id: user_id,
          sender_address: sender_address,
          recipient_address: recipient_address,
          tokens: gift,
        },
      },
      { __typename: true },
    ],
  });
  if (!insert_pending_token_gifts_one) {
    throw new Error('insert sample allocation failed');
  }
  return;
};

export default verifyHasuraRequestMiddleware(handler);
