import assert from 'assert';
import crypto from 'crypto';

import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const prisma = new PrismaClient();
  try {
    assert(req.headers?.authorization, 'No token was provided');
    const [expectedId, token] = req.headers.authorization
      .replace('Bearer ', '')
      .split('|');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const tokenRow = await prisma.accessToken.findFirst({
      where: {
        tokenable_type: 'App\\Models\\Profile',
        token: hashedToken,
        id: parseInt(expectedId),
      },
    });
    assert(tokenRow, 'The token provided was not recognized');
    const profile = await prisma.profile.findFirst({
      where: {
        id: tokenRow.tokenable_id,
      },
    });
    assert(profile, 'Profile cannot be found');
    const users = await prisma.user.findMany({
      where: {
        address: profile.address,
      },
      select: {
        id: true,
        circle_id: true,
        role: true,
      },
    });
    res.status(200).json({
      'X-Hasura-User-Id': tokenRow.tokenable_id.toString(),
      'X-Hasura-Role': profile.admin_view ? 'superadmin' : 'user',
      'X-Hasura-Circle-User-Ids': `{ ${users
        .map(u => u.id.toString())
        .join()} }`,
      'X-Hasura-Admin-Circle-Ids': `{ ${users
        .filter(u => u.role === 1)
        .map(u => u.circle_id.toString())
        .join()} }`,
    });
  } catch (e) {
    res.status(401).json({
      error: '401',
      message: e.message || 'Unexpected error',
    });
  } finally {
    await prisma.$disconnect();
  }
}
