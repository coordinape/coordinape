import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ethers } from 'ethers';
import iti from 'itiriri';
import fetch from 'node-fetch';

import { IS_LOCAL_ENV } from '../../api-lib/config';
import { gql } from '../../api-lib/Gql';
// TODO: refactor so that constants doesn't crash this, because SVG not in build
// import { USER_ROLE_ADMIN } from '../../src/config/constants';

export const USER_ROLE_ADMIN = 1;

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}

const processParam = (p: string | string[]) =>
  (Array.isArray(p) ? p[0] : p) ?? '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!IS_LOCAL_ENV) {
    res.status(401).json({
      error: 401,
      message: 'This route is only available locally.',
    });
  }

  const name = processParam(req.query.name) || 'Default';
  const address = processParam(req.query.address).toLowerCase();
  if (!ethers.utils.isAddress(address)) {
    throw new Error('Invalid address, parameter: ' + address);
  }

  const circles = await gql.getCircles();
  const profileResponse = await gql.getProfileAndMembership(address);

  if (profileResponse.profiles.length === 0) {
    await gql.insertProfiles([
      {
        address,
      },
    ]);
  }

  const circleSet = iti(profileResponse.users).toSet(u => u.circle_id);
  const newMemberships = iti(circles)
    .filter(c => !circleSet.has(c.id))
    .map(c => ({
      address,
      name,
      circle_id: c.id,
      role: USER_ROLE_ADMIN,
    }))
    .toArray();

  const result = await gql.insertMemberships(newMemberships);

  try {
    res.status(200).json(result);
  } catch (e) {
    console.error('API ERROR', e);
    res.status(501).json({
      error: '501',
      message: `Server Error ${e.message}`,
    });
  }
}
