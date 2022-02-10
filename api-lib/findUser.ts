import assert from 'assert';

import { PrismaClient, Prisma } from '@prisma/client';

export const getUserFromProfileId = async (
  profileId: number,
  circleId: bigint | number
): Promise<Prisma.PromiseReturnType<typeof prisma.user.findFirst>> => {
  const prisma = new PrismaClient();
  try {
    const profile = await prisma.profile.findFirst({
      where: {
        id: profileId,
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
  } finally {
    prisma.$disconnect();
  }
};
