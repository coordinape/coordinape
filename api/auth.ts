import assert from 'assert';
import crypto from 'crypto';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    assert(req.body?.authorization, 'No token was provided');
    const [expectedId, token] = req.body.authorization
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
      where: { id: tokenRow.tokenable_id },
    });

    res.status(200).send(
      stringify({
        body: req.body,
        query: req.query,
        cookies: req.cookies,
        profile,
      })
    );
  } catch (e) {
    res.status(500).send(e.stack || e);
  } finally {
    await prisma.$disconnect();
  }
}

const stringify = obj =>
  JSON.stringify(obj, (_, v) => (typeof v === 'bigint' ? v.toString() : v));
