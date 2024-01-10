import type { VercelRequest, VercelResponse } from '@vercel/node';

import { updateRepScore } from '../../src/features/rep/api/updateRepScore';
import { insertInteractionEvents } from '../gql/mutations';
import { EventTriggerPayload } from '../types';

type Tables =
  | 'twitter_accounts'
  | 'github_accounts'
  | 'linkedin_accounts'
  | 'emails';

const getSubEvent = (tableName: string) => {
  if (tableName === 'twitter_accounts') {
    return 'twitter';
  } else if (tableName === 'github_accounts') {
    return 'github';
  } else if (tableName === 'linkedin_accounts') {
    return 'linkedin';
  } else {
    return 'emails';
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const payload: EventTriggerPayload<Tables, 'INSERT' | 'DELETE' | 'UPDATE'> =
      req.body;
    const profileId: number =
      payload.event.data.new?.profile_id ?? payload.event.data.old?.profile_id;
    await updateRepScore(profileId);

    if (payload.event.op === 'INSERT') {
      const event_subtype = getSubEvent(payload.table.name);
      await insertInteractionEvents({
        event_type: 'linked_external_account',
        event_subtype,
        profile_id: profileId,
        data: {
          colinks: true,
          hostName: req.headers.host,
        },
      });
    }

    res.status(200).json({ message: 'ok' });
  } catch (e) {
    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}
