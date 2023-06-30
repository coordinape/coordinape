import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { DebugLogger } from '../../src/common-lib/log';
import { AirtableNotConfiguredError, insertCRMRecord } from '../airtable';
import { adminClient } from '../gql/adminClient';
import { EventTriggerPayload } from '../types';

const logger = new DebugLogger('createCircleCRM');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    event: { data },
  }: EventTriggerPayload<'circles', 'INSERT'> = req.body;

  const { id, name, organization_id, contact } = data.new;
  try {
    const { organizations_by_pk } = await adminClient.query(
      {
        organizations_by_pk: [
          { id: organization_id },
          { name: true, sample: true },
        ],
      },
      { operationName: 'getOrgNameForCRM' }
    );
    assert(organizations_by_pk);

    if (organizations_by_pk.sample) {
      const message = `crm data ignored because organization is sample - for circle ${name}`;
      res.status(200).json({ message });
      return;
    }

    const { users } = await adminClient.query(
      {
        users: [
          { where: { circle_id: { _eq: id }, role: { _eq: 1 } } },
          { profile: { name: true } },
        ],
      },
      { operationName: 'getOrgNameForCRM' }
    );
    assert(users);
    assert(users.length > 0);

    await insertCRMRecord({
      CircleName: name,
      ContactInfo: contact ?? '',
      MemberName: users[0].profile.name,
      OrgName: organizations_by_pk.name,
      // TODO: there is no way to input these yet
      // ContactMethod: '',
      // MemberProvidedNotes: '',
      // RequestedWhiteGlove: false,
    });

    res.status(200).json({ message: `crm data saved for circle ${name}` });
  } catch (e) {
    if (e instanceof AirtableNotConfiguredError) {
      const message = `crm data ignored because airtable is not configured - for circle ${name}`;
      logger.log(message);
      res.status(200).json({ message });
      return;
    }

    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}
