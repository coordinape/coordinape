import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { farcaster_fnames_select_column } from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let search: string | undefined;
  if (typeof req.query.search == 'string') {
    search = req.query.search;
  } else if (Array.isArray(req.query.address)) {
    search = req.query.search.pop();
  }

  assert(search, 'no address provided');

  const { farcaster_fnames } = await adminClient.query(
    {
      farcaster_fnames: [
        {
          where: {
            fname: { _ilike: '%' + search + '%' },
          },
          limit: 10,
          distinct_on: [farcaster_fnames_select_column.fid],
        },
        {
          custody_address: true,
          fname: true,
          profile_with_address: {
            verified_addresses: [{}, true],
            avatar_url: true,
            display_name: true,
          },
        },
      ],
    },
    {
      operationName: 'farcaster_user_search',
    }
  );

  const matches = farcaster_fnames.map(u => ({
    fname: u.fname,
    avatar_url: u.profile_with_address?.avatar_url,
    display_name: u.profile_with_address?.display_name,
    address: u.profile_with_address?.verified_addresses[0] ?? u.custody_address,
  }));

  return res.status(200).json(matches);
}
