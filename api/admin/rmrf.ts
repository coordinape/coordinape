import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { IS_LOCAL_ENV } from '../../api-lib/config';

// I probably should not write this
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const prisma = new PrismaClient();

  if (!IS_LOCAL_ENV) {
    res.status(200).json('Coordinape destroyed.'); // JK
  }

  try {
    const tables = {
      feedbacks: prisma.feedbacks,
      gift: prisma.gift,
      pending_token_gifts: prisma.pending_token_gifts,
      teammates: prisma.teammates,
      vouches: prisma.vouches,
      nominees: prisma.nominees,
      user: prisma.user,
      epoch: prisma.epoch,
      circle: prisma.circle,
      protocols: prisma.protocols,
      profile: prisma.profile,
    } as unknown as Record<
      string,
      { deleteMany: (o: Record<string, never>) => Promise<{ count: number }> }
    >;

    const events: string[] = [];
    for (const [name, table] of Object.entries(tables)) {
      const r = await table.deleteMany({});
      if (typeof r.count === 'number') {
        events.push(`Deleted ${r.count} from ${name}`);
      } else {
        console.error('Failed to deleteMany', r);
        res.status(501).json({
          error: '501',
          message: 'Failed to deleteMany',
        });
      }
    }

    res
      .status(200)
      .json(["Coordinape destroyed, I hope you're happy.", events]);
  } catch (e) {
    res.status(401).json({
      error: '401',
      message: e.message || 'Unexpected error',
    });
  } finally {
    await prisma.$disconnect();
  }
}
