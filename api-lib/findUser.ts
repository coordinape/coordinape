import assert from 'assert';
import { createHash } from 'crypto';

import { PrismaClient, Prisma } from '@prisma/client';

export const getUserFromAuthHeader = async (
  authString: string,
  circleId: bigint | number
): Promise<Prisma.PromiseReturnType<typeof prisma.user.findFirst>> => {
  const prisma = new PrismaClient();
  try {
    const [expectedId, token] = authString.replace('Bearer ', '').split('|');

    const hashedToken = createHash('sha256').update(token).digest('hex');
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
    // there is no relation between profile addresses
    // and user addresses so we manually query it here
    const user = await prisma.user.findFirst({
      where: {
        address: profile.address,
        circle_id: circleId,
      },
    });
    assert(user, `user for circle_id ${circleId} not found`);
    return user;
  } catch (e) {
    throw new e();
  } finally {
    prisma.$disconnect();
  }
};
