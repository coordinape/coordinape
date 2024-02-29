// official docs:
// https://postmarkapp.com/developer/user-guide/tracking-opens
//
// Receive Postmark webhooks and forward them to Mixpanel

import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../api-lib/gql/adminClient';
import { insertInteractionEvents } from '../../api-lib/gql/mutations';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { body } = req;

    const auth = req.headers.authorization as string;
    assert(auth, 'Missing Authorization header');
    // require Authorization header or 401
    if (auth !== process.env.POSTMARK_WEBHOOK_AUTH) {
      res.status(401).json({ success: false, message: 'invalid auth' });
      return;
    }

    const profileId = await lookupProfileIdFromEmail(body.Recipient);

    if (!profileId) {
      console.error('no profile found with verified email: ' + body.Recipient);
      res.status(200).send('OK');
      return;
    }

    await insertInteractionEvents({
      event_type: 'postmark_event',
      profile_id: profileId,
      data: {
        ...body,
      },
    });

    res.status(200).send('OK');
    return;
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}

const lookupProfileIdFromEmail = async (email: string) => {
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            emails: {
              verified_at: { _is_null: false },
              email: { _eq: email },
            },
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'lookupProfileIdFromEmail__postmarkTrack',
    }
  );
  return profiles.pop()?.id as number | undefined;
};
